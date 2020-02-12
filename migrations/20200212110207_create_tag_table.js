
exports.up = async (knex) => {
  if (!await knex.schema.hasTable('tag')) {
    await knex.schema.createTable('tag', (table) => {
      table
        .string('tag')
        .primary()
        .comment('Emoji identifying some project, like :__bee:.')
      table
        .boolean('is_archived')
        .comment('Indicates whether the project is archived.')
        .defaultTo('false')
      table
        .string('archived_ts')
        .comment('Message ts when the archived status last changed.')
        .defaultTo('0')
    })

    await knex.raw(
      `INSERT INTO tag(tag)
       SELECT DISTINCT tag FROM tagged;`
    )
  }
};

exports.down = async (knex) => {
  await knex.schema.dropTable('tag')
};
