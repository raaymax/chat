/* eslint-disable class-methods-use-this */
const { Storage } = require('@google-cloud/storage');
const { v4: uuid } = require('uuid');
const config = require('@quack/config');

const storage = new Storage();
const bucket = storage.bucket(config.storage.bucket);

class GcsStorage {
  async _handleFile(req, file, cb) {
    const fileId = uuid();
    file.stream.pipe(bucket.file(fileId).createWriteStream({
      metadata: {
        contentType: file.mimetype,
        contentDisposition: `attachment; filename="${file.originalname}"`,
        metadata: {
          filename: file.originalname,
        },
      },
    }))
      .on('error', (err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        cb(err);
      })
      .on('finish', () => {
        cb(null, { fileId, name: file.originalname, mimetype: file.mimetype });
      });
  }

  async _removeFile(req, file, cb) {
    try {
      await storage.remove(file);
      cb(null);
    } catch (err) {
      cb(err);
    }
  }

  getFile = async (fileId) => {
    const file = bucket.file(fileId);
    const [metadata] = await file.getMetadata();
    return {
      fileId,
      contentType: metadata.contentType,
      contentDisposition: metadata.contentDisposition,
      metadata: metadata.metadata,
      stream: file.createReadStream(),
    };
  };
}

module.exports = new GcsStorage();
