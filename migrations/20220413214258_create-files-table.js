exports.up = (knex) => knex.schema.createTable('files', (table) => {
  table.uuid('id')
    .defaultTo(knex.raw('gen_random_uuid()'))
    .primary();
  table.string('type').notNullable();
  table.string('name').unique().notNullable();
  table.timestamps(false, true, true);
  table.timestamp('deletedAt');
});

exports.down = (knex) => knex.schema.dropTable('files');
