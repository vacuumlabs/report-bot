import { RTMClient } from '@slack/client'

import { connectSlack, logger } from './helpers'
import config from './config'

const app = async () => {
  try {
    // initialization
    const { botToken } = config.slack
    const rtm = new RTMClient(botToken)

    // connect to Slack
    await connectSlack(rtm)
  } catch(error) {
    logger.error(error)
  }
}

app()
