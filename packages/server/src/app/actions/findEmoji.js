const Joi = require('joi');
const db = require('../../infra/database');

module.exports = {
  type: 'findEmoji',
  schema: {
    shortname: Joi.string().required(),
  },
  handler: async (req, res) => {
    const { shortname } = req.body;
    const emoji = await db.emoji.get({ shortname });
    if (emoji) {
      res.send({ type: 'emoji', ...emoji });
    } else {
      res.send({
        type: 'emoji',
        empty: true,
        shortname,
      });
    }
    res.ok();
  },
};
