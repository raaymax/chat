const Joi = require('joi');

module.exports = {
  type: 'channel:getAll',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res, {repo}) => {
    const channels = await repo.channel.getAll({ userId: req.userId });
    channels.forEach((channel) => {
      res.send({ type: 'channel', ...channel });
    });
    res.ok();
  },
};
