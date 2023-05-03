const bcrypt = require('bcrypt');
const repo = require('../infra/repositories');

module.exports = {
  login: async (login, password) => {
    const user = await repo.user.get({ login });
    return bcrypt.compareSync(password, user.password) ? user : null;
  },
};
