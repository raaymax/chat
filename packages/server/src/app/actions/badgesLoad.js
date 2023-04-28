const Joi = require('joi');
const repo = require('../../infra/repositories');

module.exports = {
  type: 'badges:load',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const badges = await repo.badge.getAll({ userId: req.userId });
    badges.forEach((badge) => res.send({ type: 'badge', ...badge }));
    res.ok({ count: badges.length });
  },
};
