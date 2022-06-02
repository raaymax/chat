const { userRepo } = require('../database/db');
const service = require('./userService');
const Errors = require('../errors');
const msgFactory = require('../message/messageFactory');

module.exports = async (self, msg) => {
    try {
      if (!self.user) return msg.error(Errors.AccessDenied());
      const [avatarUrl] = msg.args;
      self.user.avatarUrl = avatarUrl;
      await userRepo.update(self.user.id, { avatarUrl });
      return msg.ok();
    } catch (err) {
      return msg.error(Errors.UnknownError(err));
    }

}
