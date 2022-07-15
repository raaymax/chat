
const Joi = require('joi');
const { messageRepo } = require('../infra/database');
// const service = require('../message/messageService');
// const Errors = require('../errors');
const { MissingId, MessageNotExist } = require('../common/errors');

module.exports = {
  type: 'reaction',
  schema: {
    body: Joi.object({
      id: Joi.string().required(),
      reaction: Joi.string().required(),
    }),
  },
  handler: async (req, res) => {
    const { id } = req.body;
    if (!id) throw MissingId();

    const message = await messageRepo.get({ id });
    if (!message) throw MessageNotExist();

    message.reactions = message.reactions || [];
    message.reactions.push({
      userId: req.userId,
      reaction: req.body.reaction,
    });

    console.log(await messageRepo.update({ id }, { reactions: message.reactions }));
    const message2 = await messageRepo.get({ id });
    console.log(message2);
    await res.broadcast({
      id,
      type: 'message',
      ...message,
    });
    return res.ok();
  },
};
