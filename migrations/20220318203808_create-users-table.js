exports.up = knex => knex.schema.createTable('users', table => {
  table.uuid('id')
    .defaultTo(knex.raw('gen_random_uuid()'))
    .primary();
  table.string('name').notNullable();
  table.string('login').unique().notNullable()
  table.string('password');
  table.timestamps(false, true, true);
  table.timestamp('deletedAt');
})

exports.down = knex => knex.schema.dropTable('users');
