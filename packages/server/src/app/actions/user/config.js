const Joi = require('joi');
const config = require('@quack/config');
const pack = require('../../../../package.json');
const repo = require('../../../infra/repositories');

module.exports = {
  type: 'user:config',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const user = await repo.user.get({ id: req.userId });
    await res.send({
      type: 'config',
      appVersion: pack.version,
      mainChannelId: user.mainChannelId ?? (await repo.channel.get({ cid: user.id })).id,
      vapidPublicKey: config.vapid.publicKey,
    });
    await res.ok();
  },
};
