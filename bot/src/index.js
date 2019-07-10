import http from 'http'
import logger from './logger'

import {connectSlack} from './slack'

const app = async () => {
  try {
    await connectSlack()
  } catch (error) {
    logger.error(error)
  }
}

app()

http.createServer((req, res) => {
  res.writeHead(404, {'Content-Type': 'text/plain'})
  res.write('This is not a webserver!')
  res.end()
}).listen(8080)
