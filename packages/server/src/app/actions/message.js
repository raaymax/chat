const Joi = require('joi');
const db = require('../../infra/database');
const { AccessDenied } = require('../common/errors');
const push = require('../../infra/push');
const channelHelper = require('../common/channel');
const services = require('../services');

module.exports = {
  type: 'message',
  schema: {
    body: Joi.object({
      message: Joi.any().required(), // TODO: define message schema
      channelId: Joi.string().required(),
      parentId: Joi.string().optional(),
      flat: Joi.string().required().allow(''),
      clientId: Joi.string().required(),
      emojiOnly: Joi.boolean().optional().default(false),
      debug: Joi.string().optional().allow(''),
      attachments: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        fileName: Joi.string().required(),
        contentType: Joi.string().optional().allow('').empty([''])
          .default('application/octet-stream'),
      })).optional(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;
    const channel = await db.channel.get({ id: msg.channelId });
    if (!await channelHelper.haveAccess(req.userId, channel.id)) {
      throw AccessDenied();
    }

    const { id, dup } = await createMessage({
      message: msg.message,
      flat: msg.flat,
      channelId: channel.id,
      parentId: msg.parentId,
      channel: channel.cid,
      clientId: msg.clientId,
      emojiOnly: msg.emojiOnly,
      userId: req.userId,
      attachments: msg.attachments?.map((file) => ({
        id: file.id,
        fileName: file.fileName,
        contentType: file.contentType,
      })),
      createdAt: new Date(),
    });

    if (msg.parentId) {
      await db.message.updateThread({
        id,
        parentId: msg.parentId,
        userId: req.userId,
      });
      const parent = await db.message.get({ id: msg.parentId });
      res.broadcast({ type: 'message', ...parent });
    }

    const created = await db.message.get({ id });
    if (!dup) {
      res.broadcast({ type: 'message', ...created });
      await push.send(created);
    }
    await services.badges.messageSent(channel.id, msg.parentId, id, req.userId);
    res.ok(dup ? { duplicate: true } : {});
  },
};

async function createMessage(msg) {
  const data = Object.fromEntries(Object.entries(msg).filter(([, v]) => v !== undefined));
  let id; let
    dup = false;
  try {
    ({ id } = await db.message.insert(data));
  } catch (err) {
    if (err.code !== 11000) {
      throw err;
    }
    dup = true;
  }
  return { id, dup };
}
