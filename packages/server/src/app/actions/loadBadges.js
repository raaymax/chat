const Joi = require('joi');
const db = require('../../infra/database');

module.exports = {
  type: 'loadBadges',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const badges = await db.badge.getAll({ userId: req.user.id });
    badges.forEach((badge) => res.send({ type: 'badge', ...badge }));
    res.ok({ count: badges.length });
  },
};
