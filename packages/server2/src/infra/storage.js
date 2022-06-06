const { Storage } = require('@google-cloud/storage');
const { v4: uuid } = require('uuid');
const config = require('../../../../chat.config');

const storage = new Storage();
const bucket = storage.bucket(config.gcsBucket);

module.exports = {
  upload: async (file) => {
    const fileId = uuid();
    return new Promise((resolve, reject) => {
      file.stream.pipe(bucket.file(fileId).createWriteStream({
        metadata: {
          contentType: file.mimetype,
          contentDisposition: `attachment; filename="${file.originalname}"`,
          metadata: {
            filename: file.originalname,
          }
        }
      }))
      .on('error', function(err) {
        console.error(err);
        reject(err);
      })
      .on('finish', function() {
        resolve(fileId)
      });
    });
  },
  read: async (fileId) => {
    const file = bucket.file(fileId);
    const metadata = await file.getMetadata();
    console.log('metadata', metadata);
    return {
      fileId,
      contentType: metadata.body.contentType,
      contentDisposition: metadata.body.contentDisposition,
      metadata: metadata.body.metadata,
      stream: file.createReadStream(),
    }
  },

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
