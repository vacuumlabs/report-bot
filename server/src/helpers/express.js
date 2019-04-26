import express from 'express'

import { logger } from './index'
import config from '../config'

export const startServer = () => {
  const app = express()

  const appPort = config.serverPort
  app.listen(appPort, () => { logger.info(`Server started on port: ${appPort}`) })
}