/* eslint-disable camelcase */
import c from './config'
import {Client} from 'pg'

export const db = new Client(c.knex.connection)
db.connect()

export async function loadReportsByTag(tag) {
  return (await db.query(
    `SELECT ts, "user", message, channel, response_to
     FROM tagged LEFT JOIN report ON tagged.report=report.ts
     WHERE tagged.tag = $1
     ORDER BY ts ASC`,
    [tag],
  )).rows
}

export async function loadTags() {
  return (await db.query(
    `SELECT tag, count(*) as count, max(report) as "lastTs"
     FROM tagged GROUP BY tag ORDER BY tag ASC`
  )).rows
}
