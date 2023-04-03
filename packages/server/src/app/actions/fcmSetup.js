const Joi = require('joi');
const { MissingToken } = require('../common/errors');
const repo = require('../repository');

module.exports = {
  type: 'fcm:setup',
  schema: {
    body: Joi.object({
      token: Joi.string().required(),
      mobile: Joi.boolean().optional(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;
    if (!msg.token) throw MissingToken();

    const user = await repo.user.get({ id: req.userId });
    const forDelete = {};
    Object.entries(user.notifications || {}).forEach(([key, value]) => {
      if (new Date(value.refreshedAt) < new Date() - 1000 * 60 * 60 * 24 * 30) {
        forDelete[`notifications.${key}`] = '';
      }
    });
    await repo.user.update({id: req.userId}, forDelete, 'unset');
    await repo.user.update({id: req.userId}, {notifications: { [msg.token]: { mobile: msg.mobile, refreshedAt: new Date() }} }, 'set');

    return res.ok();
  },
};
