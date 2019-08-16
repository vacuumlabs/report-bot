import {WebClient} from '@slack/web-api'
import logger from './logger'
import config from './config'

import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import path from 'path'

import {loadReportsByTag, loadTags} from './db.js'
import {authorize, registerAuthRoutes} from './auth'
import * as cache from './cache'

const web = new WebClient(config.slack.appToken)

const indexById = (array) => {
  return array.reduce(
    (acc, row) => Object.assign(acc, {[row.id]: row}),
    Object.create(null)
  )
}

const users = cache.create(async (user) => {
  const u = await web.users.profile.get({user})
  return {...u.profile, id: user}
})
const channels = cache.create(async (channel) => {
  const c = await web.conversations.info({channel})
  return c.channel
})
const replies = cache.create((ts, channel) => web.conversations.replies({channel, ts}))
const emojis = cache.create(() => web.emoji.list())

const app = express()
app.set('trust proxy', 'loopback')
app.use(cookieParser())
app.use(bodyParser.json())

registerAuthRoutes(app)

// serve CRA bundle
const buildDir = path.join(`${__dirname}/../../client/build`)
app.use(express.static(buildDir))

app.get('/api/tags', authorize, async (req, res) => {
  const tags = await loadTags()
  res.json(tags)
})

function mentions(message) {
  const regexp = /<@([A-Z0-9]+)>/ug
  const users = []

  for (;;) {
    const match = regexp.exec(message)
    if (match == null) break
    users.push(match[1])
  }
  return users
}

async function loadProfiles(userIds) {
  return indexById(await Promise.all(
    userIds.map((id) => cache.get(users, id))
  ))
}

async function loadChannels(channelIds) {
  return indexById(await Promise.all(
    channelIds.map((id) => cache.get(channels, id))
  ))
}

function normalizeEmoji(emoji) {
  function url(key) {
    const u = emoji[key]
    if (u == null) return key
    if (u.startsWith('alias:')) return url(u.substring('alias:'.length))
    return emoji[key]
  }
  const res = {}
  for (const k of Object.keys(emoji)) res[k] = url(k)
  return res
}

app.get('/api/reports-by-tags/:tag', authorize, async (req, res) => {
  let reports = await loadReportsByTag(req.params.tag)
  reports = await Promise.all(reports.map(async (r) => ({
    ...r,
    replies: (
      await cache.get(
        replies, r.response_to || r.ts, r.channel
      )).messages,
  })))

  const authors = reports.map((r) => r.user)
  const replyAuthors = [].concat(...reports.map((t) => t.replies.map((r) => r.user)))
  const allMentions = [].concat(...reports.map((r) => mentions(r.message)))
  const userIds = Array.from(new Set([...authors, ...replyAuthors, ...allMentions]))
  const channelIds = Array.from(new Set(reports.map((r) => r.channel)))


  res.json({
    reports,
    users: await loadProfiles(userIds),
    channels: await loadChannels(channelIds),
    emoji: normalizeEmoji((await cache.get(emojis)).emoji),
  })
})

// endpoints
app.get('*', (req, res, next) => {
  res.sendFile(`${buildDir}/index.html`)
})

app.listen(config.port, () => {logger.info(`Server started on port: ${config.port}`)})

