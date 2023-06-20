const Joi = require('joi');
const repo = require('../../infra/repositories');
const { MissingId, NotOwnerOfMessage, MessageNotExist } = require('../common/errors');

module.exports = {
  type: 'message:update',
  schema: {
    body: Joi.object({
      id: Joi.string().required(),
      message: Joi.any().optional(), // TODO: define message schema
      channelId: Joi.string().optional(),
      flat: Joi.string().optional().allow(''),
      clientId: Joi.string().optional(),
      pinned: Joi.boolean().optional(),
      attachments: Joi.array().items(Joi.object({
        id: Joi.string().required(),
        fileName: Joi.string().required(),
        contentType: Joi.string().required(),
      })).optional(),
    }),
  },
  handler: async (req, res) => {
    const { id, ...body } = req.body;
    if (!id) throw MissingId();

    const message = await repo.message.get({ id });
    const channel = await repo.channel.get({ id: message.channelId });
    if (!message) throw MessageNotExist();

    if (req.userId !== message.userId) throw NotOwnerOfMessage();

    await repo.message.update({ id }, body);
    await res.group(channel.users, {
      id,
      type: 'message',
      ...message,
      ...body,
    });
    return res.ok();
  },
};
