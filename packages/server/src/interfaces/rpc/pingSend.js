const Joi = require('joi');

module.exports = {
  type: 'ping:send',
  schema: {
    body: Joi.any(),
  },
  handler: (req, res) => res.ok(),
};
