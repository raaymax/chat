const Joi = require('joi');
const repo = require('../repository');

module.exports = {
  type: 'emoji:find',
  schema: {
    shortname: Joi.string().required(),
  },
  handler: async (req, res) => {
    const { shortname } = req.body;
    const emoji = await repo.emoji.get({ shortname });
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
