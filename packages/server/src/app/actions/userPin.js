const Joi = require('joi');
const db = require('../../infra/database');
// const service = require('../message/messageService');
// const Errors = require('../errors');
const { MessageNotExist } = require('../common/errors');

module.exports = {
  type: 'user-pin',
  schema: {
    body: Joi.object({
      channelId: Joi.string().required(),
      id: Joi.string().required(),
      pinned: Joi.boolean().required(),
    }),
  },
  handler: async (req, res) => {
    const { id, channelId, pinned } = req.body;
    const message = await db.message.get({ id });
    if (!message) throw MessageNotExist();
    const channel = await db.channel.get({ id: channelId });

    let pins = [...(channel.pins || [])];
    const idx = pins.findIndex(id);
    if (pinned && idx === -1) {
      pins = [...pins, id];
    }
    if (!pinned && idx > -1) {
      pins = [...pins.slice(0, idx), ...pins.slice(idx + 1)];
    }

    await db.channel.update({ id: channel.id }, { pins });
    await res.broadcast({
      type: 'channel',
      ...channel,
      pins,
    });
    return res.ok();
  },
};
