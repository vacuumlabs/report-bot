
exports.up = async (knex) => {
  const report = knex('tagged').distinct('report')
  const reply_to_report = knex('report').whereIn('response_to', report).select('ts')
  const replied_by_report =
    knex('report').whereIn('ts', report).whereNotNull('response_to').distinct('response_to')

  await knex('report')
    .whereNotIn('ts', report)
    .whereNotIn('ts', reply_to_report)
    .whereNotIn('ts', replied_by_report)
    .del()
}

exports.down = async (knex) => {};
