const repo = require('../infra/repositories');
const { genHash } = require('./tools');

module.exports = {
  login: async (login, password) => {
    const user = await repo.user.get({ login, password: genHash(password) });
    return user;
  },
};
