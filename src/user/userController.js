const service = require('./userService');

module.exports = {
  restore: async (self, msg) => {
    // console.log(msg);
    const { op } = msg;
    if (!op.session) return msg.error({ code: 'SESSION_NOT_EXISTS' });
    const restored = await service.sessionRestore(op.session);
    if (!restored) return msg.error({ code: 'SESSION_NOT_RESTORED' });
    const { session, user } = restored;
    self.user = user;
    self.session = session;
    await self.op({
      type: 'setSession',
      session,
      user: {
        id: user.id,
        name: user.name,
      },
    }, msg.seqId);
    return msg.ok({ session, user });
  },

  changeName: async (self, msg) => {
    if (!self.user) return msg.error({ code: 'ACCESS_DENIED' });
    const [name] = msg.command.args;
    self.user.name = name;
    // TODO: pertist the name
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
      },
    }, msg.seqId);
    await self.sys([
      { text: 'Login successfull' }, { br: true },
      { text: `Welcome ${user.name}` }, { br: true },
    ], true, msg.seqId);
    return msg.ok({ session, user: { id: user.id, name: user.name } });
  },

};
