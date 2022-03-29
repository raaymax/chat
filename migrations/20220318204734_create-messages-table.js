exports.up = (knex) => knex.schema.createTable('messages', (table) => {
  table.uuid('id')
    .defaultTo(knex.raw('gen_random_uuid()'))
    .primary();
  table.uuid('userId')
    .references('id')
    .inTable('users')
    .onDelete('RESTRICT');
  table.string('channel').defaultTo('main');
  table.jsonb('message');
  table.text('flat');
  table.timestamps(false, true, true);
  table.timestamp('deletedAt');
});

exports.down = (knex) => knex.schema.dropTable('messages');
