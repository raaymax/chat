const Joi = require('joi');
const commands = require('../commands');

module.exports = {
  type: 'command',
  schema: {
    body: Joi.object({
      name: Joi.string().required(),
      args: Joi.array().items(Joi.string()).required(),
      context: Joi.object({
        channel: Joi.string().required(),
      }).required(),
    }),
  },
  handler: commands,
};
