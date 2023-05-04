const repo = require('../../infra/repositories');
const tools = require('../tools');

module.exports = {
  name: 'avatar',
  description: 'upload your avatar',
  args: [],
  attachments: ['image'],
  handler: async (req, res) => {
    const { attachments: [{ id }] } = req.body;
    const avatarUrl = tools.createImageUrl(id);
    await repo.user.update({ id: req.userId }, { avatarUrl, avatarFileId: id });
    const user = await repo.user.get({ id: req.userId });
    await res.broadcast({
      type: 'user',
      id: user.id,
      name: user.name,
      avatarUrl,
    });
    return res.ok();
  },
};
