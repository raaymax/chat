const repo = require('../../infra/repositories');
const { getByPath } = require('./details/helpers');

module.exports = (userPath) => async (req) => {
  const id = getByPath(userPath, req);
  const user = await repo.user.get({ id });
  return Boolean(user);
};
