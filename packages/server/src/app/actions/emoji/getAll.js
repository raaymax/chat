const Joi = require('joi');
const repo = require('../../../infra/repositories');

module.exports = {
  type: 'emoji:getAll',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const emojis = await repo.emoji.getAll();
    await Promise.all(emojis.map((emoji) => res.send({
      type: 'emoji',
      ...emoji,
      empty: false,
    })));
    res.ok();
  },
};
