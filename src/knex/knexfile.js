// extracts knex settings from config.js and exports it using a `knexfile.js` convention
// this is necessary to make knex cli work properly
require('babel-register')

// when knexfile.js is in a subdir, knex automatically changes working directory, revert this change
process.chdir(`${__dirname}/../../`)
const config = require('../config').default
module.exports = config.knex
