const isDev = process.env.NODE_ENV === 'development'
const config = {
  loginUrl: isDev ? 'http://localhost:5000/auth/login' : '/auth/login',
  slack: {
    team: 'T026LE24D',
  },
}

export default config