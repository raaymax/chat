const fileRepository = require('./fileRepository');
const Errors = require('../errors');

module.exports = (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    try {
      const dest = await fileRepository.createUploadUrl(msg.contentType);
      return msg.ok(dest);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return msg.error(Errors.UnknownError(err));
    }
  
}
