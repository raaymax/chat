const Joi = require('joi');
const db = require('../infra/database');

module.exports = {
  type: 'loadEmojis',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const emojis = await db.emoji.getAll();
    await Promise.all(emojis.map((emoji) => res.send({ type: 'emoji', ...emoji })));
    res.ok();
  },
};
