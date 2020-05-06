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
    pgClient: {
      connectionString: str('DATABASE_URL'),
      ssl: !isDev,
    },
    slack: {
      appToken: str('SLACK_APP_TOKEN'),
    },
  }
})
