const repo = require('../../infra/repositories');
const pack = require('../../../package.json');

module.exports = {
  name: 'setMain',
  description: 'Sets current channel as main',
  args: [],
  handler: async (req, res) => {
    const { channelId } = req.body.context;
    await repo.user.update({ id: req.userId }, { mainChannelId: channelId });
    await res.send({
      type: 'config',
      appVersion: pack.version,
      mainChannelId: channelId,
    });
    return res.ok();
  },
};
