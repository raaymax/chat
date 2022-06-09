const { userRepo } = require('..');

module.exports = {
  name: 'avatar',
  description: 'to change your avatar',
  args: ['url'],
  handler: async (req, res) => {
    const [avatarUrl] = req.body.args;
    await userRepo.update(req.userId, { avatarUrl });
    return res.ok();
  },
};
