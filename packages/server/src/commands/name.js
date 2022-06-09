const { userRepo } = require('../database/db');
const service = require('./userService');
const Errors = require('../errors');
const msgFactory = require('../message/messageFactory');

module.exports = async (self, msg) => {
  if (!self.user) return msg.error(Errors.AccessDenied());
  const [name] = msg.args;
  self.user.name = name;
  await userRepo.update(self.user.id, { name });
  return msg.ok();
};
