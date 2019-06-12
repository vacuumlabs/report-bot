import {WebClient} from '@slack/web-api'
import logger from './logger'
import config from './config'

import express from 'express'
import bodyParser from 'body-parser'
import querystring from 'querystring'

import {getReportsByTag} from './knex/report'
import {getTags} from './knex/tag'

import slackMessageParser, { NodeType } from 'slack-message-parser'

const app = express()
const web = new WebClient(config.slack.appToken)

// parse application/json
app.use(bodyParser.json())

// serve CRA bundle
const buildDir = `${__dirname}/../../client/build`
app.use(express.static(buildDir))

// endpoints
app.get('/', (req, res, next) => {
  res.sendFile(`${buildDir}/index.html`)
})

app.get('/api/tags', async (req, res) => {
  const tags = await getTags()
  res.json(tags)
})

function mentions(message) {
  function traverse(node) {
    if (node.type === NodeType.UserLink) return [node.userID]
    else return [].concat(...(node.children || []).map(traverse))
  }

  return traverse(slackMessageParser(message))
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
    if (u == null) return null
    if (u.startsWith('alias:')) return url(u.substring('alias:'.length))
    return emoji[key]
  }
  const res = {}
  for (const k of Object.keys(emoji)) res[k] = url(k)
  return res
}

app.get('/api/reports-by-tags/:tag', async (req, res) => {
  let reports = await getReportsByTag(req.params.tag)
  reports = await Promise.all(reports.map(async (r) => ({
    ...r,
    replies: (
        await web.conversations.replies(
          {channel: r.channel, ts: r.response_to || r.ts}
      )).messages
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

