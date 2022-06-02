const service = require('../message/messageService');
const Errors = require('../errors');

module.exports = (self, msg) => {
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
  
}
