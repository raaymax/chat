const messageRepository = require('./message/messageRepository');

exports.handleOps = async (srv, self, msg) => {
  const {op} = msg;
  switch(op.type) {
    case 'load':
      const messages = await messageRepository.getAll(op.channel);
      return messages.forEach(msg => self.send(msg));
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
  }
}
