import axios from 'axios'
import logger from './logger'
import config from './config'

import express from 'express'
import bodyParser from 'body-parser'
import querystring from 'querystring'

import {getReportsByTag} from './knex/report'
import {getTags} from './knex/tag'

const app = express()

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

app.post('/api/reports-by-tags', async (req, res) => {
  const { tag } = req.body
  const reports = await getReportsByTag(tag)
  res.json(reports)
})

app.get('/api/slack/:endpoint', async (req, res) => {
  const q = querystring.encode({
    ...req.query,
    token: config.slack.appToken,
  })


  const response = await axios.get(`https://slack.com/api/${req.params.endpoint}?${q}`)
  logger.debug(`Querrying: https://slack.com/api/${req.params.endpoint}?${q}`)
  logger.debug(`Response:`, response.data)
  res.json(response.data)
})

app.listen(config.port, () => {logger.info(`Server started on port: ${config.port}`)})

