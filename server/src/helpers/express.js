import express from 'express'

import { logger } from './index'
import config from '../config'
import { getTags } from '../knex/tag'

export const startServer = () => {
  const app = express()

  const { client: { host: clientHost, port: clientPort }, serverPort } = config

  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `${clientHost}:${clientPort}`);
    next();
  });
  
  app.get('/api/tags', async (req, res) => {
    const tags = await getTags()
    res.json(tags)
  })
  
  app.listen(serverPort, () => { logger.info(`Server started on port: ${serverPort}`) })
}