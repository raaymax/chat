const Joi = require('joi');
const { messageRepo } = require('../infra/database');
const { AccessDenied } = require('../common/errors');
const push = require('../infra/push');
const channel = require('../common/channel');

module.exports = {
  type: 'message',
  schema: {
    body: Joi.object({
      message: Joi.any().required(), // TODO: define message schema
      channel: Joi.string().required(),
      flat: Joi.string().required().allow(''),
      clientId: Joi.string().required(),
      attachments: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        fileName: Joi.string().required(),
        contentType: Joi.string().required(),
      })).optional(),
    }),
  },
  handler: async (req, res) => {
    const msg = req.body;

    if (!await channel.haveAccess(req.userId, msg.channel)) {
      throw AccessDenied();
    }

    const { id, dup } = await createMessage({
      message: msg.message,
      flat: msg.flat,
      channel: msg.channel,
      clientId: msg.clientId,
      userId: req.userId,
      attachments: msg.attachments?.map((file) => ({
        id: file.id,
        fileName: file.fileName,
        contentType: file.contentType,
      })),
      createdAt: new Date(),
    });
    const created = await messageRepo.get({ id });

    if (!dup) {
      res.broadcast({ type: 'message', ...created });
      push.send(created);
    }
    res.ok(dup ? { duplicate: true } : {});
  },
};

async function createMessage(msg) {
  let id; let
    dup = false;
  try {
    id = await messageRepo.insert(msg);
  } catch (err) {
    if (err.code !== 11000) {
      throw err;
    }
    dup = true;
  }
  return { id, dup };
}
