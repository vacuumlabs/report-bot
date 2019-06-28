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
  try {
    await rtm.start()
    logger.info('Successfully connected to Slack!')
  } catch(error) {
    throw new Error('Unable connect to Slack due to the following error ' +
      '(for more information see https://api.slack.com/methods/rtm.start):\n' + 
      error
    )
  }
}

export const getPermalink = async (channel, ts) => {
  try {
    const { permalink } = await web.chat.getPermalink({
      channel,
      token: config.slack.botToken,
      message_ts: ts,
    })
  
    return permalink
  } catch(error) {
    logger.error('Unable to get permalink of message due to following error ' +
      '(for more information see https://api.slack.com/methods/chat.getPermalink):\n' +
      error
    )

    return null
  }
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
  try {
    const channelIds = []
    let cursor
    do {
      const result = await web.users.conversations({
        cursor,
        limit: 999,
        token: config.slack.botToken,
        types: 'public_channel,private_channel',
      })

      if (!result.ok) {
        throw new Error(result.error)
      }

      channelIds.push(...result.channels.map(channel => channel.id))
      cursor = result.response_metadata.next_cursor
    }
    while (cursor)

    return channelIds
  } catch(error) {
    logger.error('Unable to get Bot channels due to following error ' +
      '(for more information see https://api.slack.com/methods/users.conversations):\n' +
      error
    )
    return null
  }
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
  try {
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
  } catch(error) {
    logger.error('Unable to get channel history due to following error ' +
      '(for more information see https://api.slack.com/methods/conversations.history):\n' +
      error
    )
    return
  }

  logger.debug(`Channel with ID ${channelId} successfully synchronized.`)
}

export const synchronize = async () => {
  logger.info('Synchronizing DB with Slack...')

  const channelIds = await getBotChannelIds()

  if (channelIds === null) {
    logger.warn('Synchronization failed!')
    return
  }

  for (const channelId of channelIds) {
    const latestTs = await getLastChannelReportTs(channelId)
    await synchronizeMessages(channelId, latestTs)
  }
  
  logger.info('Successfully synchronized!')
}
