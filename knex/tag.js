import knex from './index'
import logger from '../logger'

export const addTags = async (ts, tags) => {
  try {
    const insertIfMissing = (tag) => knex.raw(
      `INSERT INTO tag (report, tag)
        SELECT :report, :tag
        WHERE NOT EXISTS (
          SELECT id FROM tag WHERE report = :report AND tag = :tag
        )`,
      { report: ts, tag }
    )

    await Promise.all(tags.map(insertIfMissing))

    logger.debug(`Missing relations of following tags to report '%s' added to table 'tag':\n%o`, ts, tags)
  } catch (error) {
    logger.error(`Unable to add tags to table 'tag' due to following error:\n%o`, error)
  }
}

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

export const removeReportTags = async (ts) => {
  try {
    const count = await knex('tag')
      .where('report', ts)
      .delete()

    logger.debug(`Count of removed tags of report with TS '%s': %d`, ts, count)
  } catch (error) {
    logger.error(`Unable to remove tags of report with TS '%s' due to following error:\n%o`, ts, error)
  }
}
