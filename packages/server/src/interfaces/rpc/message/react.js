const Joi = require('joi');
const { MissingId, MessageNotExist } = require('../../common/errors');

// FIXME: add tests for this action
module.exports = {
  type: 'message:react',
  schema: {
    body: Joi.object({
      id: Joi.string().required(),
      reaction: Joi.string().required(),
    }),
  },
  handler: async (req, res, {repo}) => {
    const { id } = req.body;
    if (!id) throw MissingId();

    const message = await repo.message.get({ id });
    if (!message) throw MessageNotExist();

    message.reactions = message.reactions || [];
    const idx = message.reactions
      .findIndex((r) => r.userId === req.userId && r.reaction === req.body.reaction);
    if (idx === -1) {
      message.reactions.push({
        userId: req.userId,
        reaction: req.body.reaction,
      });
    } else {
      message.reactions = [...message.reactions.slice(0, idx), ...message.reactions.slice(idx + 1)];
    }

    await repo.message.update({ id }, { reactions: message.reactions });
    const channel = await repo.channel.get({ id: message.channelId });
    await res.group(channel.users, {
      id,
      type: 'message',
      ...message,
    });
    return res.ok();
  },
};
