const transenv = require('transenv').default

exports.default = transenv()(({str, bool, num}) => {
  const isDev = str('NODE_ENV') === 'development'

  return {
    knex: {
      client: 'pg',
      connection: `${str('DATABASE_URL')}${isDev ? '' : '?sslmode=no-verify'}`,
      debug: isDev,
      migrations: {
        directory: 'migrations',
      },
    },
  }
})
