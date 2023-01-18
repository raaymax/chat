const Joi = require('joi');
const { MissingToken } = require('../common/errors');
const db = require('../../infra/database');

module.exports = {
  type: 'setupFcm',
  schema: {
    body: Joi.object({
      token: Joi.string().required(),
      mobile: Joi.boolean().optional(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;
    if (!msg.token) throw MissingToken();

    const user = await db.user.get({ id: req.userId });
    const forDelete = {};
    Object.entries(user.notifications || {}).forEach(([key, value]) => {
      if (new Date(value.refreshedAt) < new Date() - 1000 * 60 * 60 * 24 * 30) {
        forDelete[`notifications.${key}`] = '';
      }
    });
    await db.user.update(req.userId, forDelete, 'unset');
    await db.user.update(req.userId, { [`notifications.${msg.token}`]: { mobile: msg.mobile, refreshedAt: new Date() } });
    return res.ok();
  },
};
