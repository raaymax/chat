const fileRepository = require('./fileRepository');
const Errors = require('../errors');

module.exports = (self, msg) => {
    if (!self.user) return msg.error(Errors.AccessDenied());
    try {
      const dest = await fileRepository.finalizeUpload(msg.fileId, msg.fileName, msg.contentType);
      return msg.ok(dest);
    } catch (err) {
      return msg.error(err);
    }
  
}
