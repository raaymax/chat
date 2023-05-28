const crypto = require('crypto');
const config = require('@quack/config');
const repo = require('../../infra/repositories');

module.exports = {
  name: 'invite',
  description: 'generate invitation link',
  args: [],
  handler: async (req, res) => {
    const token = crypto.randomBytes(16).toString('hex');

    console.log({
      token,
      userId: req.userId,
      createdAt: new Date().toISOString(),
    });
    await repo.invitation.create({
      token,
      userId: req.userId,
      createdAt: new Date().toISOString(),
    });
    res.systemMessage([
      { line: { text: 'Invitation link: ' } },
      { line: { code: `${config.baseUrl}/#/invite/${token}` } },
    ]);
    return res.ok();
  },
};
