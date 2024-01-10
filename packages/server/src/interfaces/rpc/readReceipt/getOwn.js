const Joi = require('joi');

module.exports = {
  type: 'readReceipt:getOwn',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res, {repo}) => {
    const badges = await repo.badge.getAll({ userId: req.userId });
    badges.forEach((badge) => res.send({ type: 'badge', ...badge }));
    res.ok({ count: badges.length });
  },
};
