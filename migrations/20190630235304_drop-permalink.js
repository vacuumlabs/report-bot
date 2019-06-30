exports.up = async (knex) => {
  await knex.schema.table('report', (table) => table.dropColumn('permalink'))
};

exports.down = async (knex) => {
  await knex.schema.table('report', (table) => 
    table
    .string('permalink')
    .comment('Slack link to the message created using chat.getPermalink.')
  )
};
