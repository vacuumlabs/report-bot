import transenv from 'transenv'

export default transenv()(({str, bool, num}) => {
  const env = str('NODE_ENV', 'development')
  const isDevelopment = env === 'development'

  return {
    env,
    serverPort: str('SERVER_PORT', 5000),
    logLevel: str('LOG_LEVEL', isDevelopment ? 'debug' : 'error'),
    knex: {
      client: 'pg',
      connection: {
        host: str('DB_HOST', 'localhost'),
        port: str('DB_PORT', 5432),
        user: str('DB_USER', 'report_bot'),
        password: str('DB_PASSWORD', 'postgres'),
        database: str('DB_NAME', 'postgres'),
      },
      migrations: {
        directory: 'migrations',
      },
    },
    slack: {
      botToken: str('SLACK_BOT_TOKEN'),
    },
  }
})
