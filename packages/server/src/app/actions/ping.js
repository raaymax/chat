const Joi = require('joi');

module.exports = {
  type: 'ping',
  schema: {
    body: Joi.any(),
  },
  handler: (req, res) => res.ok(),
};
