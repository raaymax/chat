const { messageRepo, userRepo } = require('../database/db');
const Errors = require('../errors');

const service = {
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

module.exports = {
  load: async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const messages = await service.getAll(msg);
    messages.forEach((m) => self.send({ type: 'message', ...m }));
    msg.ok();
  },

  isTyping: async (self, msg) => {
    if (!self.user) {
      return msg.error(Errors.AccessDenied());
    }
    if (self.user) {
      msg.user = { id: self.user.id, name: self.user.name };
      msg.userId = self.user.id;
    }
    await self.broadcast(msg);
    return msg.ok();
  },

  remove: async (self, msg) => {
    const { id } = msg;
    if (!self.user) {
      return msg.error(Errors.AccessDenied());
    }
    const message = await messageRepo.get({ id });
    if (!message) return msg.error(Errors.NotExist());
    if (self.user.id !== message.userId) {
      return msg.error(Errors.AccessDenied());
    }
    await messageRepo.remove({ id });
    await self.broadcast({
      id,
      type: 'message',
      channel: message.channel,
      message: [],
      user: {
        name: 'System',
      },
      notifType: 'warning',
      notif: 'Message removed',
    });
    return msg.ok();
  },

  handle: async (self, msg) => {
    if (!self.user) {
      return msg.error(Errors.AccessDenied());
    }
    // await new Promise(resolve => setTimeout(resolve, 10000));
    msg.createdAt = new Date();
    if (self.user) {
      msg.user = {
        id: self.user.id,
        name: self.user.name,
        avatarUrl: self.user.avatarUrl,
      };
      msg.userId = self.user.id;
    }
    msg.channel = msg.channel || self.channel;
    msg.notify = true;
    const { id } = await messageRepo.insert({
      clientId: msg.clientId,
      createdAt: msg.createdAt,
      userId: msg.userId,
      channel: msg.channel,
      message: msg.message,
      flat: msg.flat,
      attachments: msg.attachments,
    });
    msg.id = id;
    msg.type = 'message';
    await self.broadcast(msg);
    return msg.ok(msg);
  },
};
