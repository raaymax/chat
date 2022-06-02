const { v4: uuid } = require('uuid');

module.exports = {
  createSystemMessage(msg) {
    return {
      type: 'message',
      id: uuid(),
      createdAt: new Date().toISOString(),
      user: { name: 'System' },
      priv: true,
      message: [],
      ...msg,
    };
  },
};
