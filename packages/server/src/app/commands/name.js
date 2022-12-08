const db = require('../../infra/database');

module.exports = {
  name: 'name',
  description: 'change user displayed name',
  args: ['name'],
  handler: async (req, res) => {
    const [name] = req.body.args;
    await db.user.update(req.userId, { name });
    const user = await db.user.get({ id: req.userId });
    await res.broadcast({
      type: 'user',
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });
    return res.ok();
  },
};
