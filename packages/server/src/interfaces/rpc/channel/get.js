const Joi = require('joi');

module.exports = {
  type: 'channel:get',
  schema: {
    id: Joi.string().required(),
  },
  handler: async (req, res,{repo}) => {
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
