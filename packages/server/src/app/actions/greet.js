const Joi = require('joi');

module.exports = {
  type: 'greet',
  schema: {
    body: Joi.any(),
  },
  handler: async (req, res) => {
    // FIXME: make this message show?
    await res.send({
      type: 'message',
      id: 'greet',
      userId: 'system',
      priv: true,
      createdAt: new Date().toISOString(),
      message: [
        { text: 'Hello!' }, { emoji: 'wave' }, { br: true },
        { text: 'You can use "/help" to get more info' }, { br: true },
        { text: 'You won\'t be able to send any messages until you login' },
        { br: true },
      ],
    });
    await res.ok();
  },
};
