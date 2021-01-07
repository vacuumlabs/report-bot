
exports.up = async (knex) => {
	await knex.schema.alterTable('tagged', (table) => table.dropColumns('state'))
	
	await knex.schema.alterTable('tagged', (table) => {
		table
			.enu('state', ['on-track', 'off-track', 'at-risk', 'on-hold'])
			.comment('The current (last mentioned) state of a project.')
			.nullable()
			.defaultTo(null)
	})
};
  
exports.down = async (knex) => {
	await knex.schema.alterTable('tagged', (table) => table.dropColumns('state'))
	
	await knex.schema.alterTable('tagged', (table) => {
    table
      .enu('state', ['on-track', 'off-track', 'at-risk', 'on-hold'])
      .comment('The current (last mentioned) state of a project.')
      .defaultTo('on-track')
	})
};