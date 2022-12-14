const Joi = require('joi');
const pack = require('../../../package.json');
const db = require('../../infra/database');

module.exports = {
  type: 'config',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    await res.send({
      type: 'config',
      appVersion: pack.version,
      mainChannelId: (await db.channel.get({name: 'main'})).id,
    });
    await res.ok();
  },
};
