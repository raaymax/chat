const Joi = require('joi');

module.exports = {
  type: 'typing:send',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
    }),
  },
  handler: (req, res) => {
    const { channelId } = req.body;

    res.broadcast({
      type: 'typing',
      userId: req.userId,
      channelId,
    }, {
      onlyOthers: true,
    });
    res.ok();
  },
};
