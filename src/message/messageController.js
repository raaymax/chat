const messageRepository = require('./messageRepository');
const messageFlatter = require('./messageFlatter');
const {v4: uuid} = require('uuid');

module.exports = {
  load: async (self, msg) => {
    if(!self.user) return msg.error("Not logged in")
    const {op} = msg;
    const messages = await messageRepository.getAll(op);
    messages.forEach(msg => self.send(msg));
    msg.ok()
  },

  changeChannel: async (self, msg) => {
    const {args} = msg.command;
    self.channel = args[0];
    await self.op({
      type: 'setChannel',
      channel: self.channel,
    });
    msg.ok();
  },

  isTyping: async (self, msg) => {
    if(!self.user) {
      return msg.error({code: "ACCESS_DENIED"});
    }
    if(self.user){
      msg.user = {id: self.user.id, name: self.user.name};
      msg.userId = self.user.id;
    }
    await self.broadcast(msg);
    return msg.ok();
  },

  handle: async (self, msg) => { 
    if(!self.user) {
      return msg.error({code: "ACCESS_DENIED"});
    }
    //await new Promise(resolve => setTimeout(resolve, 10000));
    msg.id = uuid();
    msg.createdAt = new Date();
    if(self.user){
      msg.user = {id: self.user.id, name: self.user.name};
      msg.userId = self.user.id;
    }
    msg.channel = msg.channel || self.channel;
    msg.notify = true;
    msg.flat = messageFlatter.flat(msg.message);
    await messageRepository.insert({
      id: msg.id,
      createdAt: msg.createdAt,
      userId: msg.userId,
      channel: msg.channel,
      message: JSON.stringify(msg.message),
      flat: msg.flat,
    });
    await self.broadcast(msg);
    return msg.ok(msg);
  }
}

