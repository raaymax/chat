const { userRepo } = require('../database/db');
const service = require('./userService');
const Errors = require('../errors');

module.exports = {
  restore: async (self, msg) => {
    if (!msg.session) return msg.error(Errors.SessionNotFound());
    try {
      const restored = await service.sessionRestore(msg.session);
      const { session, user } = restored;
      self.user = {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      };
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
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return msg.error(err);
    }
  },

  changeName: async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    const [name] = msg.args;
    self.user.name = name;
    await userRepo.update(self.user.id, { name });
    return msg.ok();
  },

  changeAvatar: async (self, msg) => {
    try {
      if (!self.user) return msg.error(Errors.AccessDenied());
      const [avatarUrl] = msg.args;
      self.user.avatarUrl = avatarUrl;
      await userRepo.update(self.user.id, { avatarUrl });
      return msg.ok();
    } catch (err) {
      return msg.error(Errors.UnknownError(err));
    }
  },

  me: async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    await self.sys([
      { text: 'ID: ' }, { text: self.user.id }, { br: true },
      { text: 'User: ' }, { text: self.user.name }, { br: true },
      { text: 'Avatar: ' }, { link: { href: self.user.avatarUrl, children: { text: self.user.avatarUrl } } }, { br: true },
    ], { priv: true, seqId: msg.seqId });
    return msg.ok();
  },

  login: async (self, msg) => {
    const { args } = msg;
    const { user, session } = await service.userLogin(args[0], args[1]);
    if (!user) {
      await self.sys([
        { text: 'Login failed' }, { br: true },
      ], { priv: true });
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
    await self.sys([
      { text: 'Login successfull' }, { br: true },
      { text: `Welcome ${user.name}` }, { br: true },
    ], { priv: true, seqId: msg.seqId });

    return msg.ok({
      session,
      user: {
        id: user.id,
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
    });
  },
  logout: async (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    await service.sessionDestroy(self.session);
    await self.op({ type: 'rmSession' }, msg.seqId);
    self.user = null;
    self.session = null;
    self.author = 'Guest'; // FIXME: Do I really need this?
    msg.ok({});
  },
};
