const transenv = require('transenv').default

exports.default = transenv()(({str, bool, num}) => {
  return {
    knex: {
      client: 'pg',
      connection: str('DATABASE_URL'),
      migrations: {
        directory: 'migrations',
      },
    },
  }
})
