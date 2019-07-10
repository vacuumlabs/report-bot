import {WebClient} from '@slack/web-api'
import logger from './logger'
import config from './config'

import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import {loadReportsByTag, loadTags} from './db.js'
import {authorize, registerAuthRoutes} from './auth'

const web = new WebClient(config.slack.appToken)

const app = express()
app.set('trust proxy', 'loopback')
app.use(cookieParser())
app.use(bodyParser.json())

registerAuthRoutes(app)

// serve CRA bundle
const buildDir = `${__dirname}/../../client/build`
app.use(express.static(buildDir))

// endpoints
app.get('/', (req, res, next) => {
  res.sendFile(`${buildDir}/index.html`)
})

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
  const profiles = await Promise.all(
    userIds.map((id) => web.users.profile.get({user: id}))
  )

  const users = {}
  for (let i = 0; i < userIds.length; i++) {
    const id = userIds[i]
    users[id] = {...profiles[i].profile, id}
  }

  return users
}

async function loadChannels(channelIds) {
  const infos = await Promise.all(
    channelIds.map((id) => web.conversations.info({channel: id}))
  )

  const channels = {}
  for (const {channel} of infos) channels[channel.id] = channel

  return channels
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
      await web.conversations.replies(
        {channel: r.channel, ts: r.response_to || r.ts}
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
    emoji: normalizeEmoji((await web.emoji.list()).emoji),
  })
})

app.listen(config.port, () => {logger.info(`Server started on port: ${config.port}`)})

