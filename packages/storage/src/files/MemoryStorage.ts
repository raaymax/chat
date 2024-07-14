import * as concat from 'concat-stream';
import { v4 as uuid } from 'uuid';
import { Readable } from 'node:stream';
import { type Buffer } from "node:buffer";
import { Config } from '@quack/config';

import {
  Storage, File, FileUploadOpts,
} from '../types.ts';

class MemoryStorage implements Storage {
  files: Record<string, File> = {};

  constructor(private config: Config) {}

  async exists(fileId: string): Promise<boolean> {
    return !!this.files[fileId];
  }

  async upload(stream: NodeJS.ReadableStream, { id, mimetype, originalname }: FileUploadOpts): Promise<File> {
    return new Promise((resolve) => {
      const fileId = id || uuid();
      stream.pipe(concat({ encoding: 'buffer' }, (data: Buffer) => {
        this.files[fileId] = {
          fileId,
          contentType: mimetype,
          contentDisposition: `attachment; filename="${originalname}"`,
          metadata: {
            filename: originalname,
          },
          buffer: data,
          getStream: () => Readable.from(data),
        };
        resolve(this.files[fileId]);
      }));
    });
  }

  remove = async (fileId: string) => {
    delete this.files[fileId];
  };

  get = async (fileId: string) => {
    const file = this.files[fileId];
    // eslint-disable-next-line no-throw-literal
    if (!file) throw { code: 404, message: 'File not found' };
    return {
      ...file,
      getStream: () => Readable.from(file.buffer),
    };
  };
}

export default (config: Config): Storage => new MemoryStorage(config);
