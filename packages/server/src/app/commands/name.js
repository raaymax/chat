const repo = require('../../infra/repositories');

module.exports = {
  name: 'name',
  description: 'change user displayed name',
  args: ['name'],
  handler: async (req, res) => {
    const [name] = req.body.args;
    await repo.user.update({ id: req.userId }, { name });
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
