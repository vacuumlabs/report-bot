import knex from './index'
import logger from '../logger'

export const getReportsByTag = async (tag) => {
  try {
    const reports = await knex
      .select('*')
      .from('tag AS t')
      .leftJoin('report AS r', 'r.ts', 't.report')
      .where('t.tag', tag)

    logger.debug(`Count of reports containing tag '${tag}: %d'`, reports.length)

    return reports
  } catch (error) {
    logger.error(`Unable to load reports by tag due to following error:\n%o`, error)
    
    return []
  }
}
