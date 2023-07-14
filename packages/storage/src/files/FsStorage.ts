/* eslint-disable class-methods-use-this */
import { v4 as uuid } from 'uuid';
import {
  existsSync, mkdirSync, createWriteStream, writeFile, unlink, readFileSync, createReadStream,
} from 'fs';
import {
  Config, File, FileUploadOpts, Storage,
} from '../types';

const validateFileId = (fileId) => /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(fileId);

class FsStorage implements Storage {
  constructor(private config: Config) {
  }

  async exists(fileId: string): Promise<boolean> {
    return existsSync(`${this.config.storage.directory}/${fileId}.metadata.json`);
  }

  async upload(stream: NodeJS.ReadableStream, file?: FileUploadOpts): Promise<File> {
    return new Promise((resolve, reject) => {
      const fileId = file?.id || uuid();
      if (!validateFileId(fileId)) {
        reject(new Error('Invalid file id'));
        return;
      }

      if (!existsSync(this.config.storage.directory)) {
        mkdirSync(this.config.storage.directory);
      }
      const sink = createWriteStream(`${this.config.storage.directory}/${fileId}`);
      writeFile(`${this.config.storage.directory}/${fileId}.metadata.json`, JSON.stringify({
        contentType: file.mimetype,
        contentDisposition: `attachment; filename="${file.originalname}"`,
        metadata: {
          filename: file.originalname,
        },
      }), () => {
      // nothing
      });
      stream.pipe(sink)
        .on('error', (err) => {
        // eslint-disable-next-line no-console
          console.error(err);
          reject(err);
        })
        .on('finish', () => {
          resolve({
            fileId,
            contentType: file.mimetype,
            contentDisposition: `attachment; filename="${file.originalname}"`,
            metadata: {
              filename: file.originalname,
            },
            getStream: () => createReadStream(`${this.config.storage.directory}/${fileId}`),
          });
        });
    });
  }

  async remove(fileId: string): Promise<void> {
    unlink(`${this.config.storage.directory}/${fileId}`, () => { /* empty */ });
    unlink(`${this.config.storage.directory}/${fileId}.metadata.json`, () => { /* empty */ });
  }

  files = {};

  async get(fileId: string): Promise<File> {
    const meta = readFileSync(`${this.config.storage.directory}/${fileId}.metadata.json`, 'utf8');
    const file = JSON.parse(meta);
    // eslint-disable-next-line no-throw-literal
    if (!file) throw { code: 404, message: 'File not found' };
    return {
      ...file,
      getStream: () => createReadStream(`${this.config.storage.directory}/${fileId}`),
    };
  }
}

export default (config: Config): Storage => new FsStorage(config);
