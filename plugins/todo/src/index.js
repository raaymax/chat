const Joi = require('joi');

exports.actions = {
  type: 'system:time',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    res.send({ type: 'system:time', time: new Date().toISOString() });
    res.ok();
  },
};

exports.commands = {
  name: 'time',
  description: 'returns server time',
  handler: async (req, res) => {
    await res.systemMessage([
      { text: new Date().toISOString() },
    ]);
    res.ok();
  },
};
