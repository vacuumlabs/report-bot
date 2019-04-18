import { RTMClient, WebClient } from '@slack/client'

import { connectSlack, logger } from './helpers'
import config from './config'
import { createOnMessageListener } from './listeners/message'

const app = async () => {
  try {
    // initialization
    const { botToken } = config.slack
    const rtm = new RTMClient(botToken)
    const web = new WebClient(botToken)

    // connect to Slack
    await connectSlack(rtm)

    // attach listeners
    rtm.on('message', createOnMessageListener(web))
  } catch(error) {
    logger.error(error)
  }
}

app()
