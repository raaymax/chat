const Joi = require('joi');
const db = require('../../infra/database');

module.exports = {
  type: 'channels',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const channels = await db.channel.getAll({ userId: req.userId });
    channels.forEach((channel) => {
      res.send({ type: 'channel', ...channel });
    });
    res.ok();
  },
};
