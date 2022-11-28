const transenv = require('transenv').default

exports.default = transenv()(({str, bool, num}) => {
  const isDev = str('NODE_ENV') === 'development'

  return {
    knex: {
      client: 'pg',
      connection: str('DATABASE_URL', null) ?
      `${str('DATABASE_URL')}${isDev ? '' : '?sslmode=no-verify'}`
      : {
        host: str('DATABASE_HOST'),
        port: str('DATABASE_PORT'),
        user: str('DATABASE_USER'),
        password: str('DATABASE_PASSWORD'),
        database: str('DATABASE_NAME'),
        ssl: false
      },
      debug: isDev,
      migrations: {
        directory: 'migrations',
      },
    },
  }
})
