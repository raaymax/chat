exports.up = (knex) => knex.schema.alterTable('users', (table) => {
  table.string('avatarUrl');
});

exports.down = (knex) => knex.schema.alterTable('users', (table) => {
  table.dropColumn('avatarUrl');
});
