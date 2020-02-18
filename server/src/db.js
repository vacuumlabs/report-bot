/* eslint-disable camelcase */
import c from './config'
import {Client} from 'pg'

export const db = new Client(c.knex.connection)
db.connect()

export async function loadReports() {
  return (await db.query(
    `SELECT ts, tag, "user", message, channel, response_to
     FROM tagged LEFT JOIN report ON tagged.report=report.ts
     ORDER BY ts ASC`
  )).rows
}

export async function loadTags() {
  return (await db.query(
    `SELECT tag, count, "lastTs", is_archived as "isArchived", frequency
     FROM (SELECT tag, count(*) as count, max(report) as "lastTs"
           FROM tagged
           WHERE NOT is_command
           GROUP BY tag) t
     NATURAL JOIN tag
     ORDER BY tag ASC`
  )).rows
}
