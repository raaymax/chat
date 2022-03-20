const {v4: uuid} = require('uuid');
const messageRepository = require('./message/messageRepository');

exports.handleMessages = async (srv, self, msg) => {
    msg.id = uuid();
    msg.createdAt = new Date();
    if(self.user){
      msg.user = {id: self.user.id, name: self.user.name};
      msg.userId = self.user.id;
    }
    msg.channel = msg.channel || self.channel;
    await messageRepository.insert({
      id: msg.id,
      createdAt: msg.createdAt,
      userId: msg.userId,
      channel: msg.channel,
      message: JSON.stringify(msg.message),
    });
    return srv.broadcast(msg);
}
