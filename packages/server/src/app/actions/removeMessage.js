const Joi = require('joi');
const db = require('../../infra/database');
// const service = require('../message/messageService');
// const Errors = require('../errors');
const { MissingId, NotOwnerOfMessage, MessageNotExist } = require('../common/errors');

module.exports = {
  type: 'removeMessage',
  schema: {
    body: Joi.object({
      id: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const { id } = req.body;
    if (!id) throw MissingId();

    const message = await db.message.get({ id });
    if (!message) throw MessageNotExist();

    if (req.userId !== message.userId) throw NotOwnerOfMessage();

    await db.message.remove({ id });
    await res.broadcast({
      id,
      type: 'message',
      channelId: message.channelId,
      message: [],
      user: {
        name: 'System',
      },
      notifType: 'warning',
      notif: 'Message removed',
    });
    return res.ok();
  },
};