const {v4: uuid} = require('uuid');
const messageRepository = require('./message/messageRepository');

exports.handleMessages = async (srv, self, msg) => {
    console.log('broadcast');
    msg.id = uuid();
    msg.createdAt = new Date().toISOString();
    if(self.user){
      msg.user = {id: self.user.id, name: self.user.name};
      msg.userId = self.user.id;
    }
    msg.channel = self.channel;
    await messageRepository.insert({
      id: msg.id,
      createdAt: msg.createdAt,
      userId: msg.userId,
      message: JSON.stringify(msg.message),
    });
    return srv.broadcast(msg);
}
