import transenv from 'transenv'

export default transenv()(({str, bool, num}) => {
  const env = str('NODE_ENV', 'development')

  return {
    env,
    port: str('PORT', 3000),
  }
})