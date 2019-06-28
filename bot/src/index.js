import http from 'http'
import { RTMClient } from '@slack/rtm-api'
import { WebClient } from '@slack/web-api'
import logger from './logger'
import config from './config'

import {connectSlack, createOnMessageListener, synchronize} from './slack'

const app = async () => {
  try {
    // initialization
    const {botToken} = config.slack
    const rtm = new RTMClient(botToken)
    const web = new WebClient(botToken)

    // connect to Slack
    await connectSlack(rtm)

    // synchronize DB with Slack
    await synchronize(web)

    // attach listeners
    rtm.on('message', createOnMessageListener(web))

  } catch(error) {
    logger.error(error)
  }
}

app()

http.createServer((req, res) => {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('This is not a webserver!');
  res.end();
}).listen(8080);
