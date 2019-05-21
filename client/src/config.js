import transenv from 'transenv'

export default transenv()(({str, bool, num}) => {
  const env = str('NODE_ENV', 'development')

  return {
    env,
    port: str('PORT', 3000),
    server: {
      host: str('REACT_APP_SERVER_HOST'),
      port: str('REACT_APP_SERVER_PORT'),
    },
    slack: {
      apiToken: str('REACT_APP_SLACK_API_TOKEN'),
    },
    tagCountLimit: str('REACT_APP_TAG_COUNT_LIMIT', 20),
  }
})
