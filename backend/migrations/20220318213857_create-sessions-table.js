exports.up = knex => knex.schema.createTable('sessions', table => {
  table.uuid('id')
    .defaultTo(knex.raw('gen_random_uuid()'))
    .primary();
  table.string('series').unique().notNullable()
  table.string('token').notNullable()
  table.uuid('userId')
    .references('id')
    .inTable('users')
    .onDelete('CASCADE')
  table.timestamps(false, true, true);
  table.timestamp('deletedAt');
})

exports.down = knex => knex.schema.dropTable('sessions');
