const { userRepo } = require('../infra/database');

module.exports = {
  name: 'name',
  description: 'change user displayed name',
  args: ['name'],
  handler: async (req, res) => {
    const [name] = req.args;
    await userRepo.update(req.userId, { name });
    return res.ok();
  }
};
