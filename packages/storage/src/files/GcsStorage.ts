/* eslint-disable class-methods-use-this */
import { Storage, Bucket } from '@google-cloud/storage';
import { v4 as uuid } from 'uuid';
import {
  Config, File, FileUploadOpts, Storage as StorageInterface,
} from '../types';

class GcsStorage implements StorageInterface {
  bucket: Bucket;

  constructor(private config: Config) {
    const storage = new Storage();
    this.bucket = storage.bucket(config.storage.bucket);
  }

  async exists(fileId: string): Promise<boolean> {
    const [ret] = await this.bucket.file(fileId).exists();
    return ret;
  }

  async upload(stream: NodeJS.ReadableStream, file?: FileUploadOpts): Promise<File> {
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

  get = async (fileId: string) => {
    const file = this.bucket.file(fileId);
    const [metadata] = await file.getMetadata();
    return {
      fileId,
      contentType: metadata.contentType,
      contentDisposition: metadata.contentDisposition,
      metadata: metadata.metadata,
      getStream: () => file.createReadStream(),
    };
  };
}

export default (config: any): StorageInterface => new GcsStorage(config);
