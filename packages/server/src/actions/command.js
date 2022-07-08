const Joi = require('joi');

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
  handler: require('../commands'),
};
