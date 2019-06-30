// extracts knex settings from config.js and exports it using a `knexfile.js` convention

// when knexfile.js is in a subdir, knex automatically changes working directory, revert this change
process.chdir(`${__dirname}/../`)
const config = require('../config').default
module.exports = config.knex
