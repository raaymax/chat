const messageRepository = require('./messageRepository');
const {v4: uuid} = require('uuid');

module.exports = {
  load: async (self, msg) => {
    const {op} = msg;
    const messages = await messageRepository.getAll(op.channel);
    messages.forEach(msg => self.send(msg));
  },

  changeChannel: async (self, msg) => {
    const {args} = msg.command;
    self.channel = args[0];
    await self.op({
      type: 'setChannel',
      channel: self.channel,
    });
  },

  handle: async (self, msg) => { 
    msg.id = uuid();
    msg.createdAt = new Date();
    if(self.user){
      msg.user = {id: self.user.id, name: self.user.name};
      msg.userId = self.user.id;
    }
    msg.channel = msg.channel || self.channel;
    msg.notify = true;
    console.log('save', {
      id: msg.id,
      createdAt: msg.createdAt,
      userId: msg.userId,
      channel: msg.channel,
      message: JSON.stringify(msg.message),
    });
    await messageRepository.insert({
      id: msg.id,
      createdAt: msg.createdAt,
      userId: msg.userId,
      channel: msg.channel,
      message: JSON.stringify(msg.message),
    });
    return self.broadcast(msg);
  }
}

