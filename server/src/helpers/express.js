import express from 'express'
import bodyParser from 'body-parser'

import { logger } from './index'
import config from '../config'
import { getReportsByTag } from '../knex/report'
import { getTags } from '../knex/tag'

export const startServer = () => {
  const app = express()

  const { client: { host: clientHost, port: clientPort }, serverPort } = config

  // headers
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `${clientHost}:${clientPort}`)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    next()
  })

  // parse application/json
  app.use(bodyParser.json())

  // endpoints
  app.get('/api/tags', async (req, res) => {
    const tags = await getTags()
    res.json(tags)
  })

  app.post('/api/reports-by-tags', async (req, res) => {
    const { tag } = req.body
    const reports = await getReportsByTag(tag)
    res.json(reports)
  })

  app.listen(serverPort, () => { logger.info(`Server started on port: ${serverPort}`) })
}
