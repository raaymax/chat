const Joi = require('joi');
const repo = require('../../infra/repositories');

module.exports = {
  type: 'users:load',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const users = await repo.user.getAll();
    users.forEach((user) => res.send({
      type: 'user',
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    }));
    res.ok();
  },
};
