const Joi = require('joi');
const { messageRepo } = require('../infra/database');
const { MissingId, MessageNotExist } = require('../common/errors');

// FIXME: add tests for this action
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

    await messageRepo.update({ id }, { reactions: message.reactions });
    await res.broadcast({
      id,
      type: 'message',
      ...message,
    });
    return res.ok();
  },
};
