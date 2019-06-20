import logger from './logger'
import config from './config'
import {addReport, removeReport, updateReport} from './knex/report'
import {addTags, removeReportTags} from './knex/tag'

export const connectSlack = async (rtm) => {
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

export const getPermalink = async (web, channel, ts) => {
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

const addMessage = async (web, event) => {
  const { channel, text: message, thread_ts, ts, user } = event

  const permalink = await getPermalink(web, channel, ts)

  const report = {
    ts,
    user,
    message,
    permalink,
    channel,
    response_to: thread_ts || null,
  }

  await addReport(report)

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

export const createOnMessageListener = (web) => {
  const onMessage = async (event) => {
    logger.debug('Received following message:\n%o', event)

    const { subtype } = event

    if (!subtype) {
      await addMessage(web, event)
    } else if (subtype === 'message_changed') {
      updateMessage(event)
    } else if (subtype === 'message_deleted') {
      deleteMessage(event)
    } else if (subtype === 'channel_join') {
      // TODO: Load old messages and add them to DB.
    } else {
      logger.warn('Unsupported type of message: %s', subtype)
    }
  }

  return onMessage
}

const getBotChannelIds = async (web) => {
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

const synchronizeMessages = async (web, channelId, fromTs = 0) => {
  /**
   * TODO:
   * - load new messages from Slack,
   * - add these messages do DB.
   */
}

export const synchronize = async (web) => {
  logger.info('Synchronizing DB with Slack...')

  const channelIds = await getBotChannelIds(web)

  if (channelIds === null) {
    logger.warn('Synchronization failed!')
    return
  }

  for (const channelId of channelIds) {
    const latestTs = 0 // TODO: load last message ts from DB
    await synchronizeMessages(web, channelId, latestTs)
  }
  
  logger.info('Successfully synchronized!')
}
