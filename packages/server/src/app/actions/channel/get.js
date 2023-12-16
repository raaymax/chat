const Joi = require('joi');
const repo = require('../../../infra/repositories');

module.exports = {
  type: 'channel:get',
  schema: {
    id: Joi.string().required(),
  },
  handler: async (req, res) => {
    const { id } = req.body;
    const channel = await repo.channel.get({ id, private: false });
    if (channel) {
      res.send({
        type: 'channel',
        ...channel,
      });
    }
    res.ok();
  },
};
