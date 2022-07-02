import {App, ExpressReceiver} from '@slack/bolt'

import c from '../config'
import logger from '../logger'
import {handleMessage} from './slack'

export const boltReceiver = new ExpressReceiver({signingSecret: c.slack.signingSecret, endpoints: '/'})
export const boltApp = new App({
  token: c.slack.botToken,
  receiver: boltReceiver,
  extendedErrorHandler: true,
})

boltApp.error(async (error) => {
  logger.error(`${error.code}, ${error.message}, ${error.original?.message}`)
})

boltApp.event('message', ({event}) => handleMessage(event))
