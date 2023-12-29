const Joi = require('joi');
const repo = require('../../../infra/repositories');

module.exports = {
  type: 'user:typing',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const { channelId } = req.body;

    const channel = await repo.channel.get({ id: channelId });

    res.group(channel.users, {
      type: 'typing',
      userId: req.userId,
      channelId,
    }, {
      onlyOthers: true,
    });
    res.ok();
  },
};
