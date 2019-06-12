import http from 'http'
import { RTMClient, WebClient } from '@slack/client'
import logger from './logger'
import config from './config'

import {connectSlack, createOnMessageListener} from './slack'

const app = async () => {
  try {
    // initialization
    const {botToken} = config.slack
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

http.createServer((req, res) => {
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.write('This is not a webserver!');
  res.end();
}).listen(8080);
