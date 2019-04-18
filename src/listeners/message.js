import { getPermalink, getTags, logger } from '../helpers'
import { addReport, removeReport, updateReport } from '../knex/report'
import { addTags, removeReportTags } from '../knex/tag'

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
    } else {
      logger.warn('Unsupported type of message: %s', subtype)
    }
  }

  return onMessage
}
