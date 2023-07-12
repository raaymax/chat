const repo = require('../../infra/repositories');
const { CantRenameChannel } = require('../common/errors');

module.exports = {
  name: 'rename-channel',
  description: 'change current channel name',
  args: ['name'],
  handler: async (req, res) => {
    const { channelId } = req.body.context;
    const [name] = req.body.args;
    const channel = await repo.channel.get({ id: channelId });
    if (channel.channelType === 'DIRECT' || !channel.users.includes(req.userId)) {
      throw CantRenameChannel();
    }
    await repo.channel.update({ id: channelId }, { name });
    const updated = await repo.channel.get({ id: channelId });
    await res.group(updated.users, { type: 'channel', ...updated });
    await res.systemMessage([
      { text: `Channel renamed to ${name}` },
    ]);
    res.ok({ channelId: updated.id });
  },
};
