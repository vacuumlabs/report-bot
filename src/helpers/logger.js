import { createLogger, format, transports } from 'winston'
import config from '../config'

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.splat(),
    format.simple(),
  ),
  level: config.logLevel,
  transports: [
    new transports.Console(),
  ]
})

export default logger
