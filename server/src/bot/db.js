/* eslint-disable camelcase */
import c from '../config'
import {Client} from 'pg'

export const db = new Client(c.pgClient)
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

export async function updateReport({ts, message}) {
  return await db.query(
    'UPDATE "report" SET message = $2 WHERE ts = $1',
    [ts, message],
  )
}

export async function deleteReport(ts) {
  return await db.query('DELETE FROM "report" WHERE ts=$1', [ts])
}

export async function isReport(ts) {
  return (await db.query(
    `SELECT COUNT(*)
     FROM report JOIN tagged on report.ts = tagged.report
     WHERE ts=$1`,
    [ts],
  )).rows[0].count > 0
}

export async function getLatestReportsByChannel() {
  return (await db.query(
    'SELECT channel, MAX(ts) latest FROM report GROUP BY channel',
  )).rows
}

export async function setTags(ts, tags, isCommand, state) {
  await db.query(
    `INSERT INTO tag(tag, archived_ts, frequency_ts)
     SELECT t, $1, $1
     FROM unnest($2::text[]) t
     ON CONFLICT ON CONSTRAINT tag_pkey
     DO NOTHING`,
    [ts, tags],
  )
  return await db.query(
    `INSERT INTO "tagged"(report, tag, is_command, state)
     SELECT $1 id, t, $3, $4
     FROM unnest($2::text[]) t
     ON CONFLICT ON CONSTRAINT tagged_tag_report_unique
     DO NOTHING`,
    [ts, tags, isCommand, state],
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
    [tags, status, ts],
  )
}

export async function setFrequency(tagsWithFrequency, ts) {
  return await db.query(
    `INSERT INTO tag(tag, frequency, frequency_ts)
     SELECT tag, frequency, $3
     FROM unnest($1::text[], $2::integer[]) t(tag,frequency)
     ON CONFLICT (tag) DO UPDATE
     SET frequency=excluded.frequency, frequency_ts=$3
     WHERE tag.frequency_ts<$3`,
    [Object.keys(tagsWithFrequency), Object.values(tagsWithFrequency), ts],
  )
}
