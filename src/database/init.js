const { knex } = require('./db');
const { genHash } = require('../tools');

module.exports = async () => {
  try {
    await knex('users').insert([
      {
        id: '7ed5c52c-35f8-4a27-929d-ff5eb1a74924', login: 'melisa', password: genHash('123'), name: 'Melisa',
      },
      {
        id: 'c3875674-61f1-4793-a558-a733293f3527', login: 'mateusz', password: genHash('123'), name: 'Mateusz',
      },
    ]);
  } catch (err) {
    // ignore error
  }
};
