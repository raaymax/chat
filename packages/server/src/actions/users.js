const Joi = require('joi');
const { userRepo } = require('../infra/database');

module.exports = {
  type: 'users',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    const users = await userRepo.getAll();
    users.forEach((user) => res.send({
      type: 'user',
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    }));
    res.send({
      type: 'user',
      id: 'system',
      name: 'System',
      avatarUrl: '/assets/icon.png',
    });
    res.send({
      type: 'user',
      id: 'openai',
      name: 'OpenAI',
      avatarUrl: '/assets/openai.png',
    });
    res.ok();
  },
};
