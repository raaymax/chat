const service = require('../message/messageService');
const Errors = require('../errors');

module.exports = (self, msg) => {
    if (!self.user) {
      return msg.error(Errors.AccessDenied());
    }
    if (self.user) {
      msg.user = { id: self.user.id, name: self.user.name };
      msg.userId = self.user.id;
    }
    await self.broadcast(msg);
    return msg.ok();
  
}
