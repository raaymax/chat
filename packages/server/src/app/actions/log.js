const Joi = require('joi');
const repo = require('../repository');

// TODO api changed fix frontend
module.exports = {
  type: 'log',
  schema: {
    body: Joi.object({
      clientId: Joi.string().required(),
      level: Joi.string().required(),
      args: Joi.any(),
      createdAt: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const log = req.body;
    console.log(log);
    await repo.log.create({ scope: 'app', ...log });
    return res.ok();
  },
};
