const userRepository = require('./userRepository');
const service = require('./userService');

module.exports = {
  restore: async (self, msg) => {
    console.log('restore self.id=', self.id);
    // console.log(msg);
    const { op } = msg;
    if (!op.session) return msg.error({ code: 'SESSION_NOT_EXISTS' });
    try {
      const restored = await service.sessionRestore(op.session);
      const { session, user } = restored;
      self.user = user;
      self.session = session;
      await self.op({
        type: 'setSession',
        session,
        user: {
          id: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
        },
      }, msg.seqId);
      return msg.ok({ session, user });
    } catch(err) {
      return msg.error({ code: 'SESSION_NOT_RESTORED', reason: err.toString() });
    }
  },

  changeName: async (self, msg) => {
    if (!self.user) return msg.error({ code: 'ACCESS_DENIED' });
    const [name] = msg.command.args;
    self.user.name = name;
    await userRepository.update(self.user.id, { name });
    return msg.ok();
  },

  changeAvatar: async (self, msg) => {
    if (!self.user) return msg.error({ code: 'ACCESS_DENIED' });
    const [avatarUrl] = msg.command.args;
    self.user.avatarUrl = avatarUrl;
    await userRepository.update(self.user.id, { avatarUrl });
    return msg.ok();
  },

  login: async (self, msg) => {
    const { args } = msg.command;
    const { user, session } = await service.userLogin(args[0], args[1]);
    if (!user) {
      await self.sys([
        { text: 'Login failed' }, { br: true },
      ], true);
      return msg.error({ code: 'ACCESS_DENIED' });
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
    await self.sys([
      { text: 'Login successfull' }, { br: true },
      { text: `Welcome ${user.name}` }, { br: true },
    ], true, msg.seqId);

    return msg.ok({
      session,
      user: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  },

};
