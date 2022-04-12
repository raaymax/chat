const { Storage } = require('@google-cloud/storage');
const { v4: uuid } = require('uuid');

const storage = new Storage();
const bucket = storage.bucket('chat.codecat.io');

module.exports = {
  createUploadUrl: async (name, contentType) => {
    const fileId = uuid();
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      contentType,
    };

    const [url] = await bucket.file(fileId)
      .getSignedUrl(options);

    console.log('Generated PUT signed URL:');
    console.log(url);
    console.log('You can use this URL with any user agent, for example:');
    console.log(
      'curl -X PUT -H \'Content-Type: application/octet-stream\' '
        + `--upload-file my-file '${url}'`,
    );
    return { fileId, url };
  },
  finalizeUpload: async (fileId, name, contentType) => {
    await bucket.file(fileId)
      .setMetadata({
        contentDisposition: 'attachment; filename="'+name+'"',
      });

    return { fileId};
  },
  createPlaceholder: () => {
    const file = bucket.file(uuid());
    console.log(file);
    return file;
  },

};
