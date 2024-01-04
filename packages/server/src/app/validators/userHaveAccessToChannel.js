const repo = require('../../infra/repositories');
const {getByPath} = require('./details/helpers');

module.exports = (channelPath) => async (req) => {
  const id = getByPath(channelPath, req);

  const channel = await repo.channel.get({ id });

  if (channel?.private
      && !channel.users?.includes(req.userId)) {
    return false;
  }
  return true;
};
