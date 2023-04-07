const Joi = require('joi');
const repo = require('../repository');
const { AccessDenied } = require('../common/errors');
const channelHelper = require('../common/channel');
const services = require('../services');

module.exports = {
  type: 'message:send',
  schema: {
    body: Joi.object({
      message: Joi.any().required(), // TODO: define message schema
      channelId: Joi.string().required(),
      parentId: Joi.string().optional(),
      flat: Joi.string().required().allow(''),
      clientId: Joi.string().required(),
      emojiOnly: Joi.boolean().optional().default(false),
      debug: Joi.string().optional().allow(''),
      links: Joi.array().items(Joi.string()).optional().default([]),
      parsingErrors: Joi.array().items(Joi.any()).optional().allow(null),

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
    const channel = await repo.channel.get({ id: msg.channelId });
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
      links: msg.links,
      attachments: msg.attachments?.map((file) => ({
        id: file.id,
        fileName: file.fileName,
        contentType: file.contentType,
      })),
      createdAt: new Date(),
    });

    if (msg.parentId) {
      await repo.message.updateThread({
        id,
        parentId: msg.parentId,
        userId: req.userId,
      });
      const parent = await repo.message.get({ id: msg.parentId });
      res.broadcast({ type: 'message', ...parent });
    }

    const created = await repo.message.get({ id });
    if (!dup) {
      res.broadcast({ type: 'message', ...created });
      await services.notifications.send(created, res);
    }
    await services.badge.messageSent(channel.id, msg.parentId, id, req.userId);
    res.ok(dup ? { duplicate: true } : {});
    if (msg.links?.length) {
      services.link.addPreview(
        { messageId: id, links: msg.links },
        { bus: res.bus },
      );
    }
  },
};

async function createMessage(msg) {
  const data = Object.fromEntries(Object.entries(msg).filter(([, v]) => v !== undefined));
  let id; let
    dup = false;
  try {
    (id = await repo.message.create(data));
  } catch (err) {
    if (err.code !== 11000) {
      throw err;
    }
    dup = true;
  }
  return { id, dup };
}
