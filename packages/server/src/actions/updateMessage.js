const Joi = require('joi');
const { messageRepo } = require('../infra/database');
// const service = require('../message/messageService');
// const Errors = require('../errors');
const { MissingId, NotOwnerOfMessage, MessageNotExist } = require('../common/errors');

module.exports = {
  type: 'updateMessage',
  schema: {
    body: Joi.object({
      id: Joi.string().required(),
      message: Joi.any().optional(), // TODO: define message schema
      channel: Joi.string().optional(),
      flat: Joi.string().optional().allow(''),
      clientId: Joi.string().optional(),
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

    const message = await messageRepo.get({ id });
    if (!message) throw MessageNotExist();

    if (req.userId !== message.userId) throw NotOwnerOfMessage();

    await messageRepo.update({ id },  body);
    await res.broadcast({
      id,
      type: 'message',
      ...message,
      ...body,
    });
    return res.ok();
  },
};
