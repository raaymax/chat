const Joi = require('joi');
const repo = require('../../infra/repositories');
const { AccessDenied } = require('../common/errors');
const channelHelper = require('../common/channel');
const services = require('../services');

module.exports = {
  type: 'message:send',
  schema: {
    body: Joi.object({
      message: Joi.any().required(), // TODO: define message schema
      channelId: Joi.string().required(),
      parentId: Joi.string().optional().allow(null).default(null),
      flat: Joi.string().required().allow(''),
      clientId: Joi.string().required(),
      emojiOnly: Joi.boolean().optional().default(false),
      debug: Joi.string().optional().allow(''),
      links: Joi.array().items(Joi.string()).optional().default([]),
      mentions: Joi.array().items(Joi.string()).optional().default([]),

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

    // TODO: check users from mentions

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
      mentions: msg.mentions,
      attachments: msg.attachments?.map((file) => ({
        id: file.id,
        fileName: file.fileName,
        contentType: file.contentType,
      })),
      createdAt: new Date(),
    });

    console.log(msg.mentions, channel.users);
    const usersToAdd = msg.mentions.filter((m) => !channel.users.includes(m));
    if (usersToAdd.length) {
      const group = [...new Set([...channel.users, ...usersToAdd])];
      await repo.channel.update({ id: channel.id }, { users: group });
      const c = await repo.channel.get({ id: msg.channelId });
      res.group(group, { type: 'channel', ...c });
    }

    if (msg.parentId) {
      await repo.message.updateThread({
        id,
        parentId: msg.parentId,
        userId: req.userId,
      });
      const parent = await repo.message.get({ id: msg.parentId });
      res.group(channel.users, { type: 'message', ...parent });
    }

    const created = await repo.message.get({ id });
    if (!dup) {
      res.group(channel.users, { type: 'message', ...created });
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
