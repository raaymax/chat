const Joi = require('joi');
const db = require('../../infra/database');
const { ChannelAlreadyExist } = require('../common/errors');

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

    const existing = await db.channel.get({ name: msg.name });
    if (existing) throw ChannelAlreadyExist();

    const channel = await db.channel.create({
      name: msg.name,
      private: msg.private,
      ownerId: req.userId,
      users: [req.userId],
    });

    await db.channel.update({ id: channel.id }, { cid: channel.id });
    const ret = await db.channel.get({ id: channel.id });

    res.broadcast({ type: 'channel', ...ret });
    res.ok({});
  },
};
