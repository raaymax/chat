const { userRepo } = require('../infra/database');
const service = require('./userService');
const Errors = require('../errors');
const msgFactory = require('../message/messageFactory');

module.exports = async (self, msg) => {
  if (!self.user) return msg.error(Errors.AccessDenied());
  await self.send(msgFactory.createSystemMessage({
    seqId: msg.seqId,
    message: [
      { text: 'ID: ' }, { text: self.user.id }, { br: true },
      { text: 'User: ' }, { text: self.user.name }, { br: true },
      { text: 'Avatar: ' }, { link: { href: self.user.avatarUrl, children: { text: self.user.avatarUrl } } }, { br: true },
    ],
  }));
  return msg.ok();
};
