const Joi = require('joi');

module.exports = {
  type: 'typing',
  schema: {
    body: Joi.object({
      channel: Joi.string().required(),
    }),
  },
  handler: (req, res) => {
    const { channel } = req.body;

    res.broadcast({
      type: 'typing',
      userId: req.userId,
      channel,
    }, {
      onlyOthers: true,
    });
    res.ok();
  },
};
