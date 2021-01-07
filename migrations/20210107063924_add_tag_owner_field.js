
exports.up = async (knex) => {
	await knex.schema.alterTable('tag', (table) => {
		table
			.string('owner_id')
			.comment('Tag (project) owner slack user id.')
			.defaultTo('')
	})
};

exports.down = async (knex) => {
	await knex.schema.alterTable('tag', (table) => table.dropColumns('owner_id'))
};