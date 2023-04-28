const repo = require('../../infra/repositories');

module.exports = {
  name: 'avatar',
  description: 'to change your avatar',
  args: ['url'],
  handler: async (req, res) => {
    const [avatarUrl] = req.body.args;
    await repo.user.update({ id: req.userId }, { avatarUrl });
    const user = await repo.user.get({ id: req.userId });
    await res.broadcast({
      type: 'user',
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });
    return res.ok();
  },
};
