import knex from './index'
import { logger } from '../helpers'

export const addReport = async (report) => {
  try {
    await knex
      .insert(report)
      .into('report')

    logger.debug(`Following record added to table 'report':\n%o`, report)
  } catch (error) {
    logger.error(`Unable to add report:\n%o\ndue to following error:\n%o`, report, error)
  }
}

export const removeReport = async (ts) => {
  try {
    const count = await knex('report')
      .where('ts', ts)
      .delete()

    if (count === 0) {
      logger.warn(`Unable to remove report with TS '%s' because no such report was found.`, ts)
    } else if (count === 1) {
      logger.debug(`Report with TS '%s' was successfully removed.`, ts)
    } else {
      throw new Error('Invalid count of removed reports: %d', count)
    }
  } catch (error) {
    logger.error(`Unable to remove report with TS '%s' due to following error:\n%o`, ts, error)
  }
}

export const updateReport = async (ts, data) => {
  try {
    const count = await knex('report')
      .where('ts', ts)
      .update(data)

    if (count === 0) {
      logger.warn(`Unable to update report with TS '%s' because no such report was found.`, ts)
    } else if (count === 1) {
      logger.debug(`Report with TS '%s' updated with following data:\n%o`, ts, data)
    } else {
      throw new Error('Invalid count of updated reports: %d', count)
    }
  } catch (error) {
    logger.error(`Following error occurred during update report with TS '%s':\n%o`, ts, error)
  }
}
