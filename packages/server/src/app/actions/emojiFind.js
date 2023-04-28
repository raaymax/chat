const Joi = require('joi');
const repo = require('../../infra/repositories');

module.exports = {
  type: 'emoji:find',
  schema: {
    shortname: Joi.string().required(),
  },
  handler: async (req, res) => {
    const { shortname } = req.body;
    if (!shortname) {
      res.send({
        type: 'emoji',
        empty: true,
        shortname,
      });
    }

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
