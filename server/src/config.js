import transenv from 'transenv'

export default transenv()(({str, bool, num}) => {
  const isDev = str('NODE_ENV') === 'development'
  const disableAuth = bool('disable_auth', false) && isDev

  return {
    isDev,
    port: str('PORT', 5000),
    logLevel: str('LOG_LEVEL', isDev ? 'debug' : 'error'),
    disableAuth,
    adminGithub: str('ADMIN_GITHUB', ''),
    ...(disableAuth ? {} : {
      ssoUrl: str('VL_SSO_URL'),
      ssoKey: str('VL_SSO_KEY'),
      ssoRedirect: isDev ? 'http://localhost:3001/' : '/',
      requiredTeamId: num('required_team_id'),
    }),
    pgClient: {
      connectionString: str('DATABASE_URL', null)
      ? `${str('DATABASE_URL')}${isDev ? '' : '?sslmode=no-verify'}`
      : {
          host: str('DATABASE_HOST'),
          port: str('DATABASE_PORT'),
          user: str('DATABASE_USER'),
          password: str('DATABASE_PASSWORD'),
          database: str('DATABASE_NAME'),
          ssl: false,
        },
      ssl: !isDev,
    },
    slack: {
      botToken: str('SLACK_BOT_TOKEN'),
      signingSecret: str('SLACK_SIGNING_SECRET'),
    },
  }
})
