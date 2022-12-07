const Joi = require('joi');
const db = require('../../infra/database');
// const service = require('../message/messageService');
// const Errors = require('../errors');
const { MissingId, MessageNotExist, MissingChannel } = require('../common/errors');

module.exports = {
  type: 'user-pin',
  schema: {
    body: Joi.object({
      channel: Joi.string().required(),
      id: Joi.string().required(),
      pinned: Joi.boolean().required(),
    }),
  },
  handler: async (req, res) => {
    const { id, channel, pinned } = req.body;
    if (!id) throw MissingId();
    if (!channel) throw MissingChannel();

    const message = await db.message.get({ id });
    if (!message) throw MessageNotExist();
    const chan = await db.channel.get({ cid: channel });

    let pins = [...(chan.pins || [])];
    const idx = pins.findIndex(id);
    if (pinned && idx === -1) {
      pins = [...pins, id];
    }
    if (!pinned && idx > -1) {
      pins = [...pins.slice(0, idx), ...pins.slice(idx + 1)];
    }

    await db.channel.update({ cid: channel }, { pins });
    await res.broadcast({
      type: 'channel',
      ...chan,
      pins,
    });
    return res.ok();
  },
};
