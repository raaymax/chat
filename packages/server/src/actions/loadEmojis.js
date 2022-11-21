const Joi = require('joi');
const { emojiRepo } = require('../infra/database');

module.exports = {
  type: 'loadEmojis',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const emojis = await emojiRepo.getAll();
    await Promise.all(emojis.map((emoji) => res.send({ type: 'emoji', ...emoji })));
    res.ok();
  },
};
