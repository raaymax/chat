const { userRepo } = require('../database/db');
const service = require('./userService');
const Errors = require('../errors');
const msgFactory = require('../message/messageFactory');

module.exports = async (self, msg) => {
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
};
