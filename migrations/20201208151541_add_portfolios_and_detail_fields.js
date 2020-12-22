
exports.up = async (knex) => {
  await knex.schema.createTable('portfolio', (table) => {
    table
      .string('name')
      .primary()
      .comment('Name of the portfolio.')
  })

  await knex.schema.createTable('tag_portfolio', (table) => {
    table
      .increments('id')
      .primary()
      .comment('Tag-portfolio relationship id.')
    table
      .string('portfolio')
      .comment('Foreign key - name of the portfolio.')
      .nullable()
      .references('name')
      .inTable('portfolio')
      .onDelete('cascade')
    table
      .string('tag')
      .comment('Emoji identifying the project of this relationship (i.e. :__bee:).')
      .nullable()
      .references('tag')
      .inTable('tag')
      .onDelete('cascade')
  })

  await knex.schema.alterTable('tag', (table) => {
    table
      .string('asana_link')
      .comment('The Asana link for a project.')
      .defaultTo('')
  })

  await knex.schema.alterTable('tagged', (table) => {
    table
      .enu('state', ['on-track', 'off-track', 'at-risk', 'on-hold'])
      .comment('The current (last mentioned) state of a project.')
      .defaultTo('on-track')
  })
};

exports.down = async (knex) => {
  await knex.schema.dropTable('tag_portfolio')
  await knex.schema.dropTable('portfolio')
  await knex.schema.alterTable('tag', (table) => table.dropColumns('asana_link'))
  await knex.schema.alterTable('tagged', (table) => table.dropColumns('state'))
};