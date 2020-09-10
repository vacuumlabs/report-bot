/* eslint camelcase: 0 */
import {RTMClient} from '@slack/rtm-api'
import {WebClient} from '@slack/web-api'
import logger from './logger'
import config from './config'
import {upsertReport, updateReport, deleteReport, isReport, setTags, clearTags, getLatestReportsByChannel, archive} from './db'
import {getTags, handleCommands} from './commands'

const {appToken, botToken} = config.slack
const rtm = new RTMClient(botToken)
const web = new WebClient(appToken)

const addThreadMessages = async (channel, thread_ts) => {
  await Promise.all(
    (await loadReplies(channel, thread_ts))
      .map(({ts, user, text: message}) => upsertReport({
        ts,
        user,
        message,
        channel,
        response_to: thread_ts,
      }))
  )
}

const addThreadRootMessage = async (channel, ts) => {
  const channel_history = await web.conversations.history({
    channel,
    oldest: ts,
    latest: ts,
    inclusive: true,
  })
  const {text: message, user} = channel_history.messages[0]

  await upsertReport({ts, user, message, channel})
}

const addMessage = async (event) => {
  const {channel, text: message, thread_ts, ts, user} = event

  const report = {
    ts,
    user,
    message,
    channel,
    response_to: thread_ts,
  }

  const tags = getTags(message)
  if (tags.length && thread_ts && thread_ts !== ts) {
    await addThreadRootMessage(channel, thread_ts)
  }
  if (tags.length || (thread_ts && await isReport(thread_ts))) {
    await upsertReport(report)
  }

  const isCommand = await handleCommands({message, channel, ts}, web)

  if (tags.length) {
    await setTags(ts, tags, isCommand)
    if (!isCommand) {
      await archive(tags, false, ts) // unarchive tags
    }
  }
}

const updateMessage = async (event) => {
  const {message: {text: message, user, ts, thread_ts}, channel, ts: eventTs} = event

  await web.reactions.remove({
    token: botToken,
    channel,
    timestamp: ts,
    name: 'heavy_check_mark',
  }).catch((error) => {
    if (error.data.error !== 'no_reaction') {
      throw error
    }
  })

  const tags = getTags(message)

  if (tags.length) {
    if (thread_ts) {
      if (thread_ts === ts) {
        // the root of a thread is potentially becoming report now -> save all replies
        await upsertReport({ts, user, message, channel})
        await addThreadMessages(channel, thread_ts)
      } else {
        // a reply is potentially becoming report now -> save the thread root
        await addThreadRootMessage(channel, thread_ts)
        await upsertReport({ts, user, message, channel, response_to: thread_ts})
      }
    } else {
      await upsertReport({ts, user, message, channel})
    }
  } else {
    // update message only if it's already in the DB
    // it can be the tagless root message of a thread containing a report
    await updateReport({ts, message})
  }

  await clearTags(ts)

  const isCommand = await handleCommands({message, channel, ts, eventTs}, web)

  if (tags.length) {
    await setTags(ts, tags, isCommand)
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

async function syncMessages(channel, oldest = 0) {
  await Promise.all(
    (await loadMessages(channel, oldest))
      .map(addMessage)
  )
  logger.debug(`Channel with ID ${channel} successfully synchronized.`)
}

async function loadMessages(channel, oldest) {
  const messages = []

  for await (const page of web.paginate(
    'conversations.history',
    {channel, oldest, limit: 200},
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

async function catchUpMessages() {
  const latestReportFrom = (await getLatestReportsByChannel())
    .reduce((acc, row) => Object.assign(acc, {[row.channel]: row.latest}), {})

  const watchedChannels = (await web.users.conversations(
    {token: botToken, types: 'public_channel,private_channel'}
  )).channels.map((c) => c.id)

  for (const channel of watchedChannels) {
    await syncMessages(channel, latestReportFrom[channel])
  }

  logger.info('Successfully caught up with unprocessed messages!')
}

export const connectSlack = async () => {
  await rtm.start()
  logger.info('Successfully connected to Slack!')

  // attach listeners
  rtm.on('message', createOnMessageListener())

  await catchUpMessages()
}
