import transenv from 'transenv'

export default transenv()(({str, bool, num}) => {
  const env = str('NODE_ENV', 'development')
  const isDevelopment = env === 'development'

  return {
    env,
    logLevel: str('LOG_LEVEL', isDevelopment ? 'debug' : 'error'),
  }
})
