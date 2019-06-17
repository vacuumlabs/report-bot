import transenv from 'transenv'

export default transenv()(({str, bool, num}) => {
  const isDev = str('NODE_ENV') === 'development'
  const disableAuth = bool('disable_auth', false) && isDev

  return {
    isDev,
    port: str('PORT', 5000),
    logLevel: str('LOG_LEVEL', isDev ? 'debug' : 'error'),
    disableAuth,
    ...(disableAuth ? {} : {
      ssoUrl: str('VL_SSO_URL'),
      ssoKey: str('VL_SSO_KEY'),
      ssoRedirect: isDev ? 'http://localhost:3001/' : '/',
      requiredTeamId: num('required_team_id'),
    }),
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
      appToken: str('SLACK_APP_TOKEN'),
    },
  }
})
