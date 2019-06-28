import { RTMClient } from '@slack/rtm-api'
import { WebClient } from '@slack/web-api'
import logger from './logger'
import config from './config'
import {addReport, addOrUpdateReport, getLastChannelReportTs, removeReport, updateReport} from './knex/report'
import {addTags, removeReportTags} from './knex/tag'

// clients initialization
const {botToken} = config.slack
const rtm = new RTMClient(botToken)
const web = new WebClient(botToken)

export const attachMessageListener = () => {
  rtm.on('message', async (event) => {
    logger.debug('Received following message:\n%o', event)

    const { subtype } = event

    if (!subtype) {
      await addMessage(event)
    } else if (subtype === 'message_changed') {
      updateMessage(event)
    } else if (subtype === 'message_deleted') {
      deleteMessage(event)
    } else if (subtype === 'channel_join') {
      synchronizeMessages(event.channel)
    } else {
      logger.warn('Unsupported type of message: %s', subtype)
    }
  })
}

export const connectSlack = async () => {
  await rtm.start()
  logger.info('Successfully connected to Slack!')
}

export const getPermalink = async (channel, ts) => {
  const { permalink } = await web.chat.getPermalink({
    channel,
    message_ts: ts,
  })

  return permalink
}

export const getTags = (message) => {
  const tagRegexPattern = /:__\w+:/g
  const matches = message.match(tagRegexPattern)
  const tags = matches ? matches.map(item => item.substring(3, item.length - 1)) : []

  logger.debug('Following tags extracted from the message:\n%o', tags)

  return tags
}

const addMessage = async (event, updateOnConflict = false) => {
  const { channel, text: message, thread_ts, ts, user } = event

  const permalink = await getPermalink(channel, ts)

  const report = {
    ts,
    user,
    message,
    permalink,
    channel,
    response_to: thread_ts || null,
  }

  if (updateOnConflict) {
    await addOrUpdateReport(report)
  } else {
    await addReport(report)
  }
  
  const tags = getTags(message)

  if (tags.length) {
    await addTags(ts, tags)
  }
}

const updateMessage = async (event) => {
  const { message: { text: message, ts } } = event

  await updateReport(ts, { message })
  await removeReportTags(ts)

  const tags = getTags(message)

  if (tags.length) {
    await addTags(ts, tags)
  }
}

const deleteMessage = async (event) => {
  const { deleted_ts: ts } = event

  await removeReport(ts)
  await removeReportTags(ts)
}

const getBotChannelIds = async () => {
  const channelIds = []

  for await (const page of web.paginate('users.conversations', { types: 'public_channel,private_channel' })) {
    if (!page.ok) {
      throw new Error(page.error)
    }
    channelIds.push(...page.channels.map(channel => channel.id))
  }
  
  return channelIds
}

const addMessageWithReplies = async (channelId, message) => {
  await addMessage({ channel: channelId, ...message }, true)

  if (message.replies) {
    await Promise.all(message.replies.map(async (reply) => {
      const result = await web.conversations.replies({
        channel: channelId,
        limit: 1,
        ts: reply.ts,
        token: config.slack.appToken,
      })

      if (!result.ok) {
        throw new Error(result.error)
      }

      await addMessage({ channel: channelId, ...result.messages[0] }, true)
    }))
  }
}

const synchronizeMessages = async (channelId, fromTs = 0) => {
  let oldest = fromTs
  let hasMore

  do {
    const result = await web.conversations.history({
      channel: channelId,
      oldest,
      limit: 200,
      token: config.slack.appToken,
    })

    if (!result.ok) {
      throw new Error(result.error)
    }

    await Promise.all(result.messages.map(async (message) => {
      if (!message.subtype) {
        await addMessageWithReplies(channelId, message)
      }
    }))

    hasMore = result.has_more

    if (hasMore) {
      oldest = result.messages[0].ts
    }
  }
  while (hasMore)

  logger.debug(`Channel with ID ${channelId} successfully synchronized.`)
}

export const synchronize = async () => {
  logger.info('Synchronizing DB with Slack...')

  try {
    const channelIds = await getBotChannelIds()

    for (const channelId of channelIds) {
      const latestTs = await getLastChannelReportTs(channelId)
      await synchronizeMessages(channelId, latestTs)
    }

    logger.info('Successfully synchronized!')
  } catch(error) {
    logger.warn('Synchronization failed due to the following error:\n' + error)
  }
}
