const service = require('../message/messageService');
const Errors = require('../errors');

module.exports = (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const messages = await service.getAll(msg);
    messages.forEach((m) => self.send({ type: 'message', ...m }));
    msg.ok();
  
}
