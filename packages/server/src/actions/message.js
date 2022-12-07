const Joi = require('joi');
const db = require('../infra/database');
const { AccessDenied } = require('../common/errors');
const push = require('../infra/push');
const channelHelper = require('../common/channel');

module.exports = {
  type: 'message',
  schema: {
    body: Joi.object({
      message: Joi.any().required(), // TODO: define message schema
      channel: Joi.string().required(),
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
    const channel = await db.channel.get({cid: msg.channel});
    if (!await channelHelper.haveAccess(req.userId, msg.channel)) {
      throw AccessDenied();
    }

    const { id, dup } = await createMessage({
      message: msg.message,
      flat: msg.flat,
      channel: msg.channel,
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
    const created = await db.message.get({ id });
    await db.badge.increment({ channelId: channel.id });

    if (!dup) {
      res.broadcast({ type: 'message', ...created });
      await push.send(created);
    }
    res.ok(dup ? { duplicate: true } : {});
  },
};

async function createMessage(msg) {
  let id; let
    dup = false;
  try {
    id = await db.message.insert(msg);
  } catch (err) {
    if (err.code !== 11000) {
      throw err;
    }
    dup = true;
  }
  return { id, dup };
}
