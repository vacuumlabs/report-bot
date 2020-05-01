import transenv from 'transenv'

export default transenv()(({str, bool, num}) => {
  const isDev = str('NODE_ENV') === 'development'

  return {
    loginUrl: isDev ? 'http://localhost:5000/auth/login' : '/auth/login',
    slack: {
      team: 'T026LE24D',
    },
  }
})
