const db = require('./infra/database');
const { genHash } = require('./tools');

module.exports = {
  login: async (login, password) => {
    const user = await db.user.get({ login, password: genHash(password) });
    return user;
  },
};
