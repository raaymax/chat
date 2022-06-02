const {userRepo} = require('./infra/database');
const {genHash} = require('./tools');

module.exports = {
  login: async (login, password) => {
    const user = await userRepo.get({ login, password: genHash(password) });
    return user;
  }
}
