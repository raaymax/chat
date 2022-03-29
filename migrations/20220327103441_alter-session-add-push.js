exports.up = knex => knex.schema.alterTable('sessions', table => {
  table.jsonb('pushSubscription');
})

exports.down = knex => knex.schema.alterTable('sessions', table => {
  table.dropColumn('pushSubscription');
});
