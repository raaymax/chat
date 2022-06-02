const service = require('../message/messageService');
const Errors = require('../errors');

module.exports = (self, msg) => {
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
  
}
