const message = require('../../app/message');
const { messageRepo, userRepo } = require('../infra/database/db');
const Errors = require('../errors');

module.exports = {
  load: async (self, msg) => {
    if (!self.user) return msg.error('Not logged in');
    const messages = await message.getAll(msg);
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
    const id = await message.create(msg);
    const ret = await message.get(id);
    ret.type = 'message';
    await self.broadcast(ret);
    return msg.ok(ret);
  },
};
