const { Storage } = require('@google-cloud/storage');
const config = require('../../../../chat.config');
const { v4: uuid } = require('uuid');

const storage = new Storage();
const bucket = storage.bucket(config.gcsBucket);

module.exports = {
  createUploadUrl: async (name, contentType) => {
    const fileId = uuid();
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000,
      contentType,
    };

    const [url] = await bucket.file(fileId).getSignedUrl(options);

    return { fileId, url };
  },
  createDownloadUrl: async (fileId) => {
    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 1 * 60 * 1000,
    };

    const [url] = await bucket.file(fileId).getSignedUrl(options);

    return { fileId, url };
  },

  // eslint-disable-next-line no-unused-vars
  finalizeUpload: async (fileId, name, type) => {
    await bucket.file(fileId)
      .setMetadata({ contentDisposition: `attachment; filename="${name}"` });

    return { fileId };
  },
};
