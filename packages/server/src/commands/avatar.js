const db = require('../infra/database');

module.exports = {
  name: 'avatar',
  description: 'to change your avatar',
  args: ['url'],
  handler: async (req, res) => {
    const [avatarUrl] = req.body.args;
    await db.user.update(req.userId, { avatarUrl });
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
