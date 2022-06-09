const { userRepo } = require('../database/db');
const service = require('./userService');
const Errors = require('../errors');
const msgFactory = require('../message/messageFactory');

module.exports = async (self, msg) => {
  const { args } = msg;
  const { user, session } = await service.userLogin(args[0], args[1]);
  if (!user) {
    await self.send(msgFactory.createSystemMessage({
      seqId: msg.seqId,
      message: [
        { text: 'Login failed' }, { br: true },
      ],
    }));
    return msg.error(Errors.AccessDenied());
  }
  self.user = user;
  self.session = session;
  self.author = user.name;
  await self.op({
    type: 'setSession',
    session,
    user: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  }, msg.seqId);
  await self.send(msgFactory.createSystemMessage({
    seqId: msg.seqId,
    message: [
      { text: 'Login successfull' }, { br: true },
      { text: `Welcome ${user.name}` }, { br: true },
    ],
  }));

  return msg.ok({
    session,
    user: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
    },
  });
};
