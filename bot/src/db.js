/* eslint-disable camelcase */
import c from './config'
import {Client} from 'pg'

export const db = new Client(c.knex.connection)
db.connect()

export async function upsertReport({
  ts, user, message, channel, response_to
}) {
  return await db.query(
    `INSERT INTO "report"(ts, "user", message, channel, response_to)
     VALUES($1, $2, $3, $4, $5)
     ON CONFLICT (ts) DO UPDATE SET "message" = $3`,
    [ts, user, message, channel, response_to],
  )
}

export async function deleteReport(ts) {
  return await db.query(`DELETE FROM "report" WHERE ts=$1`, [ts])
}

export async function setTags(ts, tags) {
  return await db.query(
    `INSERT INTO "tag"(report, tag)
     SELECT $1 id, t
     FROM unnest($2::text[]) t`,
    [ts, tags],
  )
}

export async function clearTags(ts) {
  return await db.query(`DELETE FROM "tag" WHERE report=$1`, [ts])
}
