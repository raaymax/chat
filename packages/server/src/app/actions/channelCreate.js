const Joi = require('joi');
const repo = require('../../infra/repositories');
const services = require('../services');

module.exports = {
  type: 'channel:create',
  schema: {
    body: Joi.object({
      channelType: Joi.string().valid('PUBLIC', 'PRIVATE', 'DIRECT').optional().default('PUBLIC'),
      name: Joi.string().required(),
      users: Joi.array().items(Joi.string()).optional(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;

    // TODO: check if users exist

    const channelId = await services.channel.create({
      name: msg.name,
      userId: req.userId,
      channelType: msg.channelType,
      users: msg.users,
    });

    const ret = await repo.channel.get({ id: channelId });
    res.broadcast({ type: 'channel', ...ret });
    res.ok({});
  },
};
