const Joi = require('joi');
const repo = require('../../../infra/repositories');

module.exports = {
  type: 'user:typing',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
      parentId: Joi.string().optional().allow(null),
    }),
  },
  handler: async (req, res) => {
    const { channelId } = req.body;

    const channel = await repo.channel.get({ id: channelId });

    // TODO typing should know in which parent it is?
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
