const Joi = require('joi');
const commands = require('../commands');
const pack = require('../../package.json');

module.exports = {
  type: 'command',
  schema: {
    body: Joi.object({
      name: Joi.string().required(),
      args: Joi.array().items(Joi.string()).required(),
      context: Joi.object({
        channel: Joi.string().required(),
        appVersion: Joi.string().optional().default(pack.version),
      }).required(),
    }),
  },
  handler: commands,
};
