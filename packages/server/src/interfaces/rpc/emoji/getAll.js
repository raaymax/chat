const Joi = require('joi');

module.exports = {
  type: 'emoji:getAll',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res, {repo}) => {
    const emojis = await repo.emoji.getAll();
    await Promise.all(emojis.map((emoji) => res.send({
      type: 'emoji',
      ...emoji,
      empty: false,
    })));
    res.ok();
  },
};
