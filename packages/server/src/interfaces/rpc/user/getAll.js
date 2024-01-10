const Joi = require('joi');
const tools = require('../../tools');

module.exports = {
  type: 'user:getAll',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res, { bus, repo }) => {
    const users = await repo.user.getAll();
    users.forEach((user) => res.send({
      type: 'user',
      id: user.id,
      name: user.name,
      lastSeen: user.lastSeen,
      system: user.system,
      avatarUrl: tools.createImageUrl(user.avatarFileId),
      connected: bus.hasKey(user.id),
    }));
    res.ok();
  },
};
