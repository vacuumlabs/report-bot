import { logger } from './index'

export const connectSlack = async (rtm) => {
  try {
    await rtm.start()
    logger.info('Successfully connected to Slack!')
  } catch(error) {
    throw new Error('Unable connect to Slack due to the following error ' +
      '(for more information see https://api.slack.com/methods/rtm.start):\n' + 
      error
    )
  }
}
