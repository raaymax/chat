/* eslint-disable class-methods-use-this */
import { Storage, Bucket } from '@google-cloud/storage';
import { v4 as uuid } from 'uuid';
import { Config } from '@quack/config';
import {
  File, FileOpts, FileUploadOpts, Storage as StorageInterface,
} from '../types.ts';

class GcsStorage implements StorageInterface {
  bucket: Bucket;

  constructor(private config: Config) {
    if(config.storage.type !== 'gcs' ) {
      throw new Error('Invalid storage type');
    }
    const storage = new Storage();
    this.bucket = storage.bucket(config.storage.bucket);
  }

  async exists(fileId: string): Promise<boolean> {
    const [ret] = await this.bucket.file(fileId).exists();
    return ret;
  }

  async upload(stream: NodeJS.ReadableStream, fileOpts?: FileUploadOpts): Promise<File> {
    const file = fileOpts ?? { mimetype: 'application/octet-stream', originalname: 'file' };

    return new Promise((resolve, reject) => {
      const fileId = file?.id ?? uuid();
      stream.pipe(this.bucket.file(fileId).createWriteStream({
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
            getStream: () => this.bucket.file(fileId).createReadStream(),
          });
        });
    });
  }

  async remove(fileId: string): Promise<void> {
    await this.bucket.file(fileId).delete();
  }

  get = async (fileId: string, options?: FileOpts): Promise<File> => {
    const file = this.bucket.file(fileId);
    const [metadata] = await file.getMetadata();
    return {
      fileId,
      contentType: metadata.contentType || 'application/octet-stream',
      contentDisposition: metadata.contentDisposition || 'attachment; filename="file"',
      metadata: metadata.metadata as {
        filename: string,
        [key: string]: any,
      },
      getStream: () => file.createReadStream(),
    };
  };
}

export default (config: any): StorageInterface => new GcsStorage(config);
