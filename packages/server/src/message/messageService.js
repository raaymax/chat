const { messageRepo, userRepo } = require('../database/db');
const Errors = require('../errors');

module.exports = {
  get: async (id) => {
    const msg = await messageRepo.get({ id });
    if (!msg) return null;
    msg.user = await userRepo.get({ id: msg.userId });
    return msg;
  },

  getAll: async (query) => {
    const users = await userRepo.getAll();
    const userMap = users.reduce((acc, u) => ({
      ...acc,
      [u.id]: { id: u.id, name: u.name, avatarUrl: u.avatarUrl },
    }), {});
    const messages = await messageRepo.getAll(query);
    return messages.map((m) => ({ ...m, ...(m.userId ? { user: userMap[m.userId] } : {}) }));
  },

  create: async ({ userId, clientId, message, flat, attachments, channel = 'main' }) => {
    const { id } = await messageRepo.insert({
      createdAt: new Date(),
      userId,
      channel,
      clientId,
      message,
      flat,
      attachments,
    });
    return id;
  },

  remove: async (id) => {
    const message = await messageRepo.get({ id });
    if (!message) return null;
    await messageRepo.remove({ id });
    return id;
  },
};
