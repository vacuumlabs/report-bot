
exports.up = async (knex) => {
  await knex.schema.alterTable('tagged', (table) => {
    table
      .boolean('is_command')
      .comment('Indicates whether the tagged report is a command.')
      .defaultTo('false')
      .notNullable()
      .alter()
  })
};

exports.down = async (knex) => {
  await knex.schema.alterTable('tagged', (table) => {
    table
      .boolean('is_command')
      .comment('Indicates whether the tagged report is a command.')
      .defaultTo('false')
      .alter()
  })
};