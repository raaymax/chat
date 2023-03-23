const Joi = require('joi');
const db = require('../../infra/database');
const { ChannelAlreadyExist } = require('../common/errors');
const services = require('../services');


module.exports = {
  type: 'createChannel',
  schema: {
    body: Joi.object({
      name: Joi.string().required(),
      private: Joi.boolean().optional().default(false),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;

    const channelId = await services.channel.create(
      msg.name,
      req.userId,
    );

    await db.channel.update({ id: channelId }, { private: msg.private });
    const ret = await db.channel.get({ id: channelId });

    res.broadcast({ type: 'channel', ...ret });
    res.ok({});
  },
};
