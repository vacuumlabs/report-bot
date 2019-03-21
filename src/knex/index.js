import knexLib from 'knex'
import config from '../config'

const knex = knexLib(config.knex)

export default knex
