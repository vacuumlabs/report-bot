import logger from '../logger'
import config from '../config'
import {archive, setFrequency} from './db'

const tagRegexPattern = /:__([a-zA-Z0-9'_+-]+):/g
const stateRegexPattern = /:(on-track|on-hold|at-risk|off-track):/g

const commands = [
  {
    pattern: /^(un)?archive\s/,
    action: async (match, message, ts) => {
      const tags = getTags(message)
      const isArchive = !match[1]
      await archive(tags, isArchive, ts)
    },
  },
  {
    pattern: /^frequency\s/,
    action: async (match, message, ts) => {
      const tagFrequencyPattern = new RegExp(`${tagRegexPattern.source}\\s+(\\d+)`, 'g')
      const tagsWithFrequency = Object.create(null)
      let result
      while ((result = tagFrequencyPattern.exec(message)) !== null) {
        tagsWithFrequency[result[1]] = result[2]
      }
      await setFrequency(tagsWithFrequency, ts)
    },
  },
]

export function getTags(message) {
  const matches = message.match(tagRegexPattern)
  const tags = matches ? matches.map((item) => item.substring(3, item.length - 1)) : []

  logger.debug('Following tags extracted from the message:\n%o', tags)

  return tags
}

export function getState(message) {
  const matches = message.match(stateRegexPattern)
  const states = matches ? matches.map((item) => item.substring(1, item.length - 1)) : []

  logger.debug('Following states extracted from the message:\n%o', states)

  return states.length > 0 ? states[0] : null
}

export async function handleCommands(event, client) {
  const {botToken} = config.slack
  const {message, channel, ts: messageTs, eventTs = messageTs} = event
  let isCommand = false
  for (const {pattern, action} of commands) {
    const match = message.match(pattern)
    if (!match) continue
    logger.debug(`executing ${match[0]}`)
    await action(match, message, eventTs)
    await client.reactions.add({
      token: botToken,
      channel,
      timestamp: messageTs,
      name: 'heavy_check_mark',
    })
    isCommand = true
  }
  return isCommand
}
