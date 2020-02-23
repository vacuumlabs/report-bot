
exports.up = async (knex) => {
  await knex.schema.alterTable('tag', (table) => {
    table
      .integer('frequency')
      .comment('The expected frequency of reports (in days) for a project.')
      .defaultTo(16)
    table
      .string('frequency_ts')
      .comment('Message ts when the frequency last changed.')
      .defaultTo('0')
  })
};

exports.down = async (knex) => {
  await knex.schema.alterTable('tag', (table) => table.dropColumns('frequency', 'frequency_ts'))
};
