const Joi = require('joi');
const repo = require('../../../infra/repositories');

module.exports = {
  type: 'channel:get_all',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const channels = await repo.channel.getAll({ userId: req.userId });
    channels.forEach((channel) => {
      res.send({ type: 'channel', ...channel });
    });
    res.ok();
  },
};
