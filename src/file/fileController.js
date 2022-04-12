
const fileRepository = require('./fileRepository');
const Errors = require('../errors');

module.exports = {
  initUpload: async (self, msg) => {
    const { op } = msg;
    try{
      const dest = await fileRepository.createUploadUrl(op.contentType);
      return msg.ok(dest);
    } catch (err) {
      return msg.error(err);
    }
  },
  finalizeUpload: async (self, msg) => {
    const { op } = msg;
    try{
      const dest = await fileRepository.finalizeUpload(op.fileId, op.fileName, op.contentType);
      return msg.ok(dest);
    } catch (err) {
      return msg.error(err);
    }
  },
};
