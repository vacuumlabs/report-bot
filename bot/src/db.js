/* eslint-disable camelcase */
import c from './config'
import {Client} from 'pg'

export const db = new Client(c.knex.connection)
db.connect()

export async function upsertReport({
  ts, user, message, channel, response_to,
}) {
  return await db.query(
    `INSERT INTO "report"(ts, "user", message, channel, response_to)
     VALUES($1, $2, $3, $4, $5)
     ON CONFLICT (ts) DO UPDATE SET "message" = $3`,
    [ts, user, message, channel, response_to],
  )
}

export async function deleteReport(ts) {
  return await db.query('DELETE FROM "report" WHERE ts=$1', [ts])
}

export async function getLatestReportsByChannel() {
  return (await db.query(
    'SELECT channel, MAX(ts) latest FROM report GROUP BY channel'
  )).rows
}

export async function setTags(ts, tags) {
  await db.query(
    `INSERT INTO tag(tag, archived_ts, frequency_ts)
     SELECT t, $1, $1
     FROM unnest($2::text[]) t
     ON CONFLICT ON CONSTRAINT tag_pkey
     DO NOTHING`,
    [ts, tags]
  )
  return await db.query(
    `INSERT INTO "tagged"(report, tag)
     SELECT $1 id, t
     FROM unnest($2::text[]) t
     ON CONFLICT ON CONSTRAINT tagged_tag_report_unique
     DO NOTHING`,
    [ts, tags],
  )
}

export async function clearTags(ts) {
  return await db.query('DELETE FROM "tagged" WHERE report=$1', [ts])
}

export async function archive(tags, status, ts) {
  tags = [...new Set(tags)]
  return await db.query(
    `INSERT INTO tag(tag, is_archived, archived_ts)
     SELECT t, $2, $3
     FROM unnest($1::text[]) t
     ON CONFLICT (tag) DO UPDATE
     SET is_archived=$2, archived_ts=$3
     WHERE tag.archived_ts<$3`,
    [tags, status, ts]
  )
}
