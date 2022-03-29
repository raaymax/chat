exports.up = (knex) => knex.schema.alterTable('sessions', (table) => {
  table.dropColumn('series');
});

exports.down = (knex) => knex.schema.alterTable('sessions', (table) => {
  table.string('series').unique().notNullable();
});
