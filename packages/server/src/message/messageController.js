const { messageRepo, userRepo } = require('../database/db');
const Errors = require('../errors');

module.exports = {
  load: async (self, msg) => {
    if (!self.user) return msg.error('Not logged in');
    const { op } = msg;
    const users = await userRepo.getAll();
    const userMap = users.reduce((acc, u) => ({
      ...acc,
      [u.id]: { id: u.id, name: u.name, avatarUrl: u.avatarUrl },
    }), {});
    const messages = await messageRepo.getAll(op);
    messages.forEach((m) => self.send({ ...m, ...(m.userId ? { user: userMap[m.userId] } : {}) }));
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
    const { id } = msg.op;
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
    await self.broadcast(msg);
    return msg.ok(msg);
  },
};
