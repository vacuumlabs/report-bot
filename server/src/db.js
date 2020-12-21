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
      `SELECT tag, count, lastTs as "lastTs", is_archived AS "isArchived", frequency, 
            t.state, tg.asana_link AS "asanaLink", p.portfolios 
      FROM (SELECT t1.tag, t2.state, t1.count, t1.lastTs
            FROM (SELECT tag, Count(*) AS count, Max(report) AS lastTs
                  FROM   tagged 
                  WHERE  NOT is_command 
                  GROUP  BY tag) t1 
            INNER JOIN tagged t2 ON t1.lastTs=t2.report) t 
      NATURAL JOIN tag tg
      LEFT JOIN (SELECT tag AS tag, array_agg(portfolio) AS portfolios 
      FROM tag_portfolio 
      GROUP BY tag) p USING (tag) 
      ORDER BY tag ASC`
    )
  ).rows
}

export async function updateTag(tag, isArchived, asanaLink, portfolios) {
  try {
    await db.query('BEGIN')
    await db.query(
      `UPDATE tag SET is_archived=$1, asana_link=$2
       WHERE tag=$3`,
      [isArchived, asanaLink, tag]
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
