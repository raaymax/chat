/* eslint-disable class-methods-use-this */
import { v4 as uuid } from 'uuid';
import { Config } from '@quack/config';
import {
  existsSync, mkdirSync, createWriteStream, writeFile, unlink, readFileSync, createReadStream,
} from 'node:fs';
import {
  File, FileUploadOpts, Storage,
} from '../types.ts';

const validateFileId = (fileId: string) => /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(fileId);

class FsStorage implements Storage {
  directory: string;
  constructor(private config: Config) {
    if(config.storage.type !== 'fs' ) {
      throw new Error('Invalid storage type');
    }
    this.directory = config.storage.directory;
    // empty
  }

  async exists(fileId: string): Promise<boolean> {
    return existsSync(`${this.directory}/${fileId}.metadata.json`);
  }

  async upload(stream: NodeJS.ReadableStream, fileOpts?: FileUploadOpts): Promise<File> {
    const file = fileOpts ?? { mimetype: 'application/octet-stream', originalname: 'file' };

    return new Promise((resolve, reject) => {
      const fileId = file?.id || uuid();
      if (!validateFileId(fileId)) {
        reject(new Error('Invalid file id'));
        return;
      }

      if (!existsSync(this.directory)) {
        mkdirSync(this.directory);
      }
      const sink = createWriteStream(`${this.directory}/${fileId}`);
      writeFile(`${this.directory}/${fileId}.metadata.json`, JSON.stringify({
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
            getStream: () => createReadStream(`${this.directory}/${fileId}`),
          });
        });
    });
  }

  async remove(fileId: string): Promise<void> {
    unlink(`${this.directory}/${fileId}`, () => { /* empty */ });
    unlink(`${this.directory}/${fileId}.metadata.json`, () => { /* empty */ });
  }

  files = {};

  async get(fileId: string): Promise<File> {
    const meta = readFileSync(`${this.directory}/${fileId}.metadata.json`, 'utf8');
    const file = JSON.parse(meta);
    // eslint-disable-next-line no-throw-literal
    if (!file) throw { code: 404, message: 'File not found' };
    return {
      ...file,
      getStream: () => createReadStream(`${this.directory}/${fileId}`),
    };
  }
}

export default (config: Config): Storage => new FsStorage(config);
