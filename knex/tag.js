import knex from './index'
import logger from '../logger'

export const getTags = async () => {
  try {
    const tags = await knex
      .select(
        'tag',
        knex.raw('count(*) AS count')
      )
      .from('tag')
      .groupBy('tag')

    logger.debug(`Following tags loaded from table 'tag':\n%o`, tags)

    return tags
  } catch (error) {
    logger.error(`Unable to load tags from table 'tag' due to following error:\n%o`, error)
    
    return []
  }
}
