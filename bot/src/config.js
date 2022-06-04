import transenv from 'transenv'

export default transenv()(({str, bool, num}) => {
  const isDev = str('NODE_ENV') === 'development'

  return {
    logLevel: str('LOG_LEVEL', isDev ? 'debug' : 'error'),
    pgClient: {
      connectionString: `${str('DATABASE_URL')}${isDev ? '' : '?sslmode=no-verify'}`,
      ssl: !isDev,
    },
    slack: {
      appToken: str('SLACK_APP_TOKEN'),
      botToken: str('SLACK_BOT_TOKEN'),
    },
  }
})
