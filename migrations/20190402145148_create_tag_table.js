exports.up = async (knex) => {
  const tagTableExists = await knex.schema.hasTable('tag')

  if (!tagTableExists) {
    await knex.schema.createTable('tag', (table) => {
      table
        .increments('id')
        .primary()
      table
        .string('tag')
        .comment('Emoji present in the message or message threads that begin with __, such as :__finance:.')
        .index()
      table
        .string('report')
        .comment('ID of the report that this tag is related to.')
        .references('ts')
        .inTable('report')
        .onDelete('cascade')
    })
  }
}

exports.down = async (knex) => {
  await knex.schema.dropTable('tag')
}
