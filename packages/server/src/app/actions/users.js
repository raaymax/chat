const Joi = require('joi');
const db = require('../../infra/database');

module.exports = {
  type: 'users',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const users = await db.user.getAll();
    users.forEach((user) => res.send({
      type: 'user',
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    }));
    res.ok();
  },
};
