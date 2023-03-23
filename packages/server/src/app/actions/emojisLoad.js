const Joi = require('joi');
const db = require('../../infra/database');

module.exports = {
  type: 'emojis:load',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const emojis = await db.emoji.getAll();
    await Promise.all(emojis.map((emoji) => res.send({ type: 'emoji', empty: !emoji.fileId, ...emoji })));
    res.ok();
  },
};
