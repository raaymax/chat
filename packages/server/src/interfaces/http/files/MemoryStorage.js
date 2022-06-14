const concat = require('concat-stream');
const { v4: uuid } = require('uuid');
const { Readable } = require('stream');

class MemoryStorage {
  files = {};

  _handleFile = (req, file, cb) => {
    const fileId = uuid();
    file.stream.pipe(concat({ encoding: 'buffer' }, (data) => {
      this.files[fileId] = {
        fileId,
        contentType: file.mimetype,
        contentDisposition: `attachment; filename="${file.originalname}"`,
        metadata: {
          filename: file.originalname,
        },
        buffer: data,
      };
      cb(null, this.files[fileId]);
    }));
  };

  _removeFile = (req, file, cb) => {
    delete this.files[file.fileId];
    cb(null);
  };

  getFile = async (fileId) => {
    const file = this.files[fileId];
    // eslint-disable-next-line no-throw-literal
    if (!file) throw { code: 404, message: 'File not found' };
    return {
      ...file,
      stream: Readable.from(file.buffer),
    };
  };
}

module.exports = new MemoryStorage();
