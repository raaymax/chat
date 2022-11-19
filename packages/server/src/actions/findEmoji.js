const Joi = require('joi');
const { channelRepo } = require('../infra/database');

module.exports = {
  type: 'findEmoji',
  schema: {
    shortname: Joi.string().required(),
  },
  handler: async (req, res) => {
    const { shortname } = req.body;
    res.send({
      type: 'emoji',
      url: 'https://emoji.slack-edge.com/TB72FRZKQ/pingu-pout/382f67a78a40482f.png',
      shortname,
    });
    res.ok();
  },
};
