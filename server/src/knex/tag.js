import knex from './index'
import { logger } from '../helpers'

export const addTags = async (ts, tags) => {
  try {
    const data = tags.map(tag => ({
      report: ts,
      tag
    }))

    await knex
      .insert(data)
      .into('tag')

    logger.debug(`Following tags added to table 'tag':\n%o`, data)
  } catch (error) {
    logger.error(`Unable to add tags to table 'tag' due to following error:\n%o`, error)
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