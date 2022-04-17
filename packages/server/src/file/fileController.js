const fileRepository = require('./fileRepository');
const Errors = require('../errors');

module.exports = {
  initUpload: async (self, msg) => {
    const { op } = msg;
    try {
      const dest = await fileRepository.createUploadUrl(op.contentType);
      return msg.ok(dest);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return msg.error(Errors.UnknownError(err));
    }
  },
  finalizeUpload: async (self, msg) => {
    const { op } = msg;
    try {
      const dest = await fileRepository.finalizeUpload(op.fileId, op.fileName, op.contentType);
      return msg.ok(dest);
    } catch (err) {
      return msg.error(err);
    }
  },
  initDownload: async (self, msg) => {
    const { op } = msg;
    try {
      const dest = await fileRepository.createDownloadUrl(op.fileId);
      return msg.ok(dest);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return msg.error(Errors.UnknownError(err));
    }
  },
};
