const Joi = require('joi');
const { MissingToken } = require('../common/errors');

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

    req.session.fcmToken = msg.token;
    req.session.mobile = msg.mobile;
    await req.session.save();

    return res.ok();
  },
};
