const crypto = require('crypto');
const config = require('@quack/config');

module.exports = {
  name: 'invite',
  description: 'generate invitation link',
  args: [],
  handler: async (req, res, {repo}) => {
    const token = crypto.randomBytes(16).toString('hex');

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
