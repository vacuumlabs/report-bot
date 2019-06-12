exports.up = async (knex) => {
  const reportTableExists = await knex.schema.hasTable('report')

  if (!reportTableExists) {
    await knex.schema.createTable('report', (table) => {
      table
        .string('ts')
        .comment('Message ts when the message was created.')
        .primary()
      table
        .string('user')
        .comment('Slack ID of a user who has created the message.')
      table
        .text('message')
        .comment('Content of the message.')
      table
        .string('permalink')
        .comment('Slack link to the message created using chat.getPermalink.')
      table
        .string('channel')
        .comment('ID of the channel the message was posted in.')
      table
        .string('response_to')
        .comment('Ts of the main message that this reply is related to.')
        .nullable()
        .references('ts')
        .inTable('report')
        .onDelete('cascade')
    })
  }
}

exports.down = async (knex) => {
  await knex.schema.dropTable('report')
}
