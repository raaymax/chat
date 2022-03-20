const messageRepository = require('./message/messageRepository');


//const pushRepository = require('./message/pushRepository');

exports.handleOps = async (srv, self, msg) => {
  const {op} = msg;
  switch(op.type) {
    case 'load':
      const messages = await messageRepository.getAll(op.channel);
      messages.forEach(msg => self.send(msg));
      return;
    case 'restore':
      if(!op.session) return;
      const restored = await srv.users.sessionRestore(op.session);
      if(!restored) return;
      const {session, user} = restored;
      self.user = user;
      await self.op({
        type: 'set:session',
        session,
      });
      return;
    case 'set:notifications':
      if(!op.subscription) return;
      if(!self.user) return;
      self.sub = op.subscription;
      return;
      //pushRepository.insert({userId, self.user.id, })
  }
}
