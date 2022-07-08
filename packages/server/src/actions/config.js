const Joi = require('joi');
const pack = require('../../package.json');

module.exports = {
  type: 'config',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    await res.send({
      type: 'config',
      appVersion: pack.version,
    });
    await res.ok();
  },
};
