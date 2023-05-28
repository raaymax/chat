/* eslint-disable class-methods-use-this */
const { v4: uuid } = require('uuid');
const fs = require('fs');
const config = require('@quack/config');

class FsStorage {
  files = {};

  _handleFile = (req, file, cb) => {
    const fileId = uuid();
    if (!fs.existsSync(config.storage.directory)) {
      fs.mkdirSync(config.storage.directory);
    }
    const sink = fs.createWriteStream(`${config.storage.directory}/${fileId}`);
    fs.writeFile(`${config.storage.directory}/${fileId}.metadata.json`, JSON.stringify({
      contentType: file.mimetype,
      contentDisposition: `attachment; filename="${file.originalname}"`,
      metadata: {
        filename: file.originalname,
      },
    }), () => {
      // nothing
    });
    file.stream.pipe(sink)
      .on('error', (err) => {
        // eslint-disable-next-line no-console
        console.error(err);
        cb(err);
      })
      .on('finish', () => {
        cb(null, { fileId, name: file.originalname, mimetype: file.mimetype });
      });
  };

  _removeFile = (req, file, cb) => {
    fs.unlink(`${config.storage.directory}/${file.fileId}`, () => { /* empty */ });
    fs.unlink(`${config.storage.directory}/${file.fileId}.metadata.json`, () => { /* empty */ });
    cb(null);
  };

  getFile = async (fileId) => {
    const meta = fs.readFileSync(`${config.storage.directory}/${fileId}.metadata.json`, 'utf8');
    const file = JSON.parse(meta);
    const stream = fs.createReadStream(`${config.storage.directory}/${fileId}`);
    // eslint-disable-next-line no-throw-literal
    if (!file) throw { code: 404, message: 'File not found' };
    return {
      ...file,
      stream,
    };
  };
}

module.exports = new FsStorage();
