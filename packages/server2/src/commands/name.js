const { userRepo } = require('../infra/database');

module.exports = {
  name: 'name',
  description: 'change user displayed name',
  args: ['name'],
  handler: async (req, res) => {
    const [name] = req.body.args;
    await userRepo.update(req.userId, { name });
    const user = await userRepo.get({id: req.userId});
    await res.broadcast({
      type: 'user',
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    });
    return res.ok();
  }
};
