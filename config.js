const transenv = require('transenv').default

exports.default = transenv()(({str, bool, num}) => {
  return {
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
  }
})
