import {RTMClient} from '@slack/rtm-api'
import {WebClient} from '@slack/web-api'
import logger from './logger'
import config from './config'
import {upsertReport, deleteReport, setTags, clearTags} from './db'

const {botToken} = config.slack
const rtm = new RTMClient(botToken)
const web = new WebClient(botToken)

export const connectSlack = async () => {
  await rtm.start()
  logger.info('Successfully connected to Slack!')

  // attach listeners
  rtm.on('message', createOnMessageListener())
}

const getPermalink = async (channel, ts) => {
  const { permalink } = await web.chat.getPermalink({
    channel,
    message_ts: ts,
  })
  return permalink
}

const getTags = (message) => {
  const tagRegexPattern = /:__\w+:/g
  const matches = message.match(tagRegexPattern)
  const tags = matches ? matches.map(item => item.substring(3, item.length - 1)) : []

  logger.debug('Following tags extracted from the message:\n%o', tags)

  return tags
}

const addMessage = async (event) => {
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

  await upsertReport(report)

  const tags = getTags(message)

  if (tags.length) {
    await setTags(ts, tags)
  }
}

const updateMessage = async (event) => {
  const { message: { text: message, ts } } = event

  await upsertReport({ts, message})
  await clearTags(ts)

  const tags = getTags(message)

  if (tags.length) {
    await setTags(ts, tags)
  }
}

const deleteMessage = async (event) => {
  const { deleted_ts: ts } = event

  await deleteReport(ts)
  await clearTags(ts)
}

const createOnMessageListener = () => {
  const onMessage = async (event) => {
    logger.debug('Received following message:\n%o', event)

    const { subtype } = event

    if (!subtype) {
      await addMessage(event)
    } else if (subtype === 'message_changed') {
      updateMessage(event)
    } else if (subtype === 'message_deleted') {
      deleteMessage(event)
    } else {
      logger.warn('Unsupported type of message: %s', subtype)
    }
  }

  return onMessage
}
