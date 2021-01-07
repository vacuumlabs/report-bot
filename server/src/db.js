/* eslint-disable camelcase */
import _ from 'lodash'
import c from './config'
import {Client} from 'pg'
import format from 'pg-format'

export const db = new Client(c.pgClient)
db.connect()

export async function loadReports() {
  return (
    await db.query(
      `SELECT ts, tag, "user", message, channel, response_to
      FROM tagged
      LEFT JOIN report ON tagged.report=report.ts
      ORDER BY ts ASC`
    )
  ).rows
}

export async function loadReplies() {
  return (
    await db.query(
      `SELECT ts, "user", message, channel, response_to
      FROM report
      ORDER BY ts ASC`
    )
  ).rows
}

export async function loadTags() {
  return (
    await db.query(
      `-- collect all data together
      SELECT t1.last_report_ts AS "lastTs", tagged.tag, t3.state,
        tag.asana_link as "asanaLink", tag.is_archived AS "isArchived",
        tag.owner_id as "ownerId", tag.frequency, t1.count, portfolios
      FROM tagged 
      JOIN (
        -- get the most recent reports
        SELECT tag, max(report) last_report_ts, count(*) count
        FROM tagged 
        group by tag
      ) t1 ON (tagged.report = t1.last_report_ts and tagged.tag = t1.tag)
      LEFT JOIN (
        -- get the most recent states
        SELECT tagged.tag, tagged.state FROM tagged JOIN (
          -- get the most recent tags containing state
          SELECT tag, max(report) last_state_ts 
            FROM (
              -- find all tags with states
              SELECT tag, report 
              FROM tagged 
              where state is not null
            ) t1
            group by tag
        ) t2 ON (t2.last_state_ts = tagged.report and t2.tag = tagged.tag)
      ) t3 ON (t3.tag = tagged.tag)
      -- add tag info to the collection
      JOIN tag on (tagged.tag = tag.tag)
      LEFT JOIN (
        -- add portfolios to the collection
        SELECT tag, array_agg(portfolio) AS portfolios 
        FROM tag_portfolio 
        group by tag
      ) t4
      ON (tag.tag = t4.tag)`
    )
  ).rows
}

export async function updateTag(tag, isArchived, asanaLink, ownerId, portfolios) {
  try {
    await db.query('BEGIN')
    await db.query(
      `UPDATE tag SET is_archived=$1, asana_link=$2, owner_id=$3
       WHERE tag=$4`,
      [isArchived, asanaLink, ownerId, tag]
    )
    await db.query('DELETE FROM tag_portfolio WHERE tag=$1', [tag])
    const values = portfolios.map((p) => [tag, p])
    if (!_.isEmpty(values)) {
      await db.query(
        format('INSERT INTO tag_portfolio (tag, portfolio) VALUES %L', values)
      )
    }
    await db.query('COMMIT')

    return (
      await db.query(
        `SELECT tag, is_archived as "isArchived", portfolios, asana_link as "asanaLink"
        FROM tag
        LEFT JOIN (SELECT tag, array_agg(portfolio) AS portfolios 
                  FROM tag_portfolio
                  GROUP BY tag) p USING (tag) 
                  ORDER BY tag ASC`
      )
    ).rows
  } catch (e) {
    await db.query('ROLLBACK')
    return e
  }
}

export async function loadPortfolios() {
  return (
    await db.query(
      `SELECT name
      FROM portfolio
      ORDER BY name ASC`
    )
  ).rows
}

export async function createPortfolio(name) {
  try {
    return (
      await db.query('INSERT INTO portfolio (name) VALUES ($1)', [name])
    ).rows
  } catch (e) {
    return e
  }
}

export async function deletePortfolio(name) {
  try {
    return (
      await db.query('DELETE FROM portfolio WHERE name=$1', [name])
    ).rows
  } catch (e) {
    return e
  }
}
