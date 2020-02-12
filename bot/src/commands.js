import logger from './logger'
import {archive} from './db'

const commands = [
  {
    pattern: /^(un)?archive\s/,
    action: async (match, tags, ts) => {
      const isArchive = !match[1]
      await archive(tags, isArchive, ts)
    },
  },
]

export function getTags(message) {
  const tagRegexPattern = /:__[a-zA-Z0-9'_+-]+:/g
  const matches = message.match(tagRegexPattern)
  const tags = matches ? matches.map((item) => item.substring(3, item.length - 1)) : []

  logger.debug('Following tags extracted from the message:\n%o', tags)

  return tags
}

export async function handleCommands(event) {
  const {text: message, ts} = event
  const tags = getTags(message)
  for (const {pattern, action} of commands) {
    const match = message.match(pattern)
    if (!match) continue
    logger.debug(`executing ${match[0]}`)
    await action(match, tags, ts)
  }
}
