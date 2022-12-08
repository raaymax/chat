const Joi = require('joi');
const commands = require('../commands');
const pack = require('../../../package.json');

module.exports = {
  type: 'command',
  schema: {
    body: Joi.object({
      name: Joi.string().required(),
      args: Joi.array().items(Joi.string()).required(),
      attachments: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        fileName: Joi.string().required(),
        contentType: Joi.string().optional().allow('').empty([''])
          .default('application/octet-stream'),
      })).optional(),
      context: Joi.object({
        channel: Joi.string().required(),
        appVersion: Joi.string().optional().default(pack.version),
      }).required(),
    }),
  },
  handler: commands,
};
