/* eslint camelcase: 0 */
import {RTMClient} from '@slack/rtm-api'
import {WebClient} from '@slack/web-api'
import logger from './logger'
import config from './config'
import {upsertReport, deleteReport, setTags, clearTags} from './db'

const {appToken, botToken} = config.slack
const rtm = new RTMClient(botToken)
const web = new WebClient(appToken)

const getTags = (message) => {
  const tagRegexPattern = /:__[a-zA-Z0-9'_+-]+:/g
  const matches = message.match(tagRegexPattern)
  const tags = matches ? matches.map((item) => item.substring(3, item.length - 1)) : []

  logger.debug('Following tags extracted from the message:\n%o', tags)

  return tags
}

const addMessage = async (event) => {
  const {channel, text: message, thread_ts, ts, user} = event

  const report = {
    ts,
    user,
    message,
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
  const {message: {text: message, ts}} = event

  await upsertReport({ts, message})
  await clearTags(ts)

  const tags = getTags(message)

  if (tags.length) {
    await setTags(ts, tags)
  }
}

const deleteMessage = async (event) => {
  const {deleted_ts: ts} = event

  await deleteReport(ts)
  await clearTags(ts)
}

const createOnMessageListener = () => {
  const onMessage = async (event) => {
    logger.debug('Received following message:\n%o', event)

    const {subtype} = event

    if (!subtype) {
      await addMessage(event)
    } else if (subtype === 'message_changed') {
      updateMessage(event)
    } else if (subtype === 'message_deleted') {
      deleteMessage(event)
    } else if (subtype.endsWith('_join')) {
      await syncMessages(event.channel)
    } else {
      logger.warn('Unsupported type of message: %s', subtype)
    }
  }

  return onMessage
}

async function syncMessages(channel) {
  await Promise.all(
    (await loadMessages(channel))
      .map(addMessage)
  )
  logger.debug(`Channel with ID ${channel} successfully synchronized.`)
}

async function loadMessages(channel) {
  const messages = []

  for await (const page of web.paginate(
    'conversations.history',
    {channel, oldest: 0, limit: 200},
  )) {
    if (!page.ok) throw new Error(page.error)

    const loadedMsg = page.messages.filter((m) => !m.subtype)
    const replies = (await Promise.all(
      loadedMsg
        .filter((m) => m.replies)
        .map((m) => loadReplies(channel, m.ts))
    )).reduce((acc, val) => acc.concat(val), []) // flat

    messages.push(...loadedMsg, ...replies)
  }

  return messages.map((m) => ({channel, ...m}))
}

async function loadReplies(channel, ts) {
  const replies = []
  for await (const page of web.paginate(
    'conversations.replies',
    {channel, ts, limit: 200},
  )) replies.push(...page.messages)

  replies.shift()
  return replies
}

export const connectSlack = async () => {
  await rtm.start()
  logger.info('Successfully connected to Slack!')

  // attach listeners
  rtm.on('message', createOnMessageListener())
}
