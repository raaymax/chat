const Joi = require('joi');
const db = require('../../infra/database');

module.exports = {
  type: 'badgesLoad',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const badges = await db.badge.getAll({ userId: req.userId });
    badges.forEach((badge) => res.send({ type: 'badge', ...badge }));
    res.ok({ count: badges.length });
  },
};
