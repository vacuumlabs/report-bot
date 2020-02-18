
exports.up = async (knex) => {
  await knex.schema.renameTable('tag', 'tagged')
  await knex.raw('ALTER TABLE tagged RENAME CONSTRAINT "tag_pkey" TO "tagged_pkey"');
  await knex.raw('ALTER TABLE tagged RENAME CONSTRAINT "tag_tag_report_unique" TO "tagged_tag_report_unique"');
  await knex.raw('ALTER TABLE tagged RENAME CONSTRAINT "tag_report_foreign" TO "tagged_report_foreign"');
};

exports.down = async (knex) => {
  await knex.raw('ALTER TABLE tagged RENAME CONSTRAINT "tagged_report_foreign" TO "tag_report_foreign"');
  await knex.raw('ALTER TABLE tagged RENAME CONSTRAINT "tagged_tag_report_unique" TO "tag_tag_report_unique"');
  await knex.raw('ALTER TABLE tagged RENAME CONSTRAINT "tagged_pkey" TO "tag_pkey"');
  await knex.schema.renameTable('tagged', 'tag')
};
