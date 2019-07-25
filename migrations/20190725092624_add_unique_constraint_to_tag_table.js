
exports.up = async (knex) => {
  await knex.raw(`
    DELETE FROM
      Tag a
        USING Tag b
    WHERE
      a.id > b.id
      AND a.tag = b.tag
      AND a.report = b.report;`)

  await knex.schema.alterTable('tag', function(table) {
    table.unique(['tag', 'report'])
  })
};

exports.down = async (knex) => {
  await knex.schema.alterTable('tag', function(table) {
    table.dropUnique(['tag', 'report'])
  })
};