import sharp from 'sharp';
import { Config } from '@quack/config';
import files from './files/index.ts';
import {
  Storage, File, FileOpts, FileUploadOpts,
} from './types.ts';

class Files implements Storage {
  static getFileId = (id: string, width: number, height:number) => `${id}-${width}x${height}`;

  private service: Storage;

  constructor(private config: Config) {
    this.service = files(this.config);
  }

  async upload(stream: NodeJS.ReadableStream, options?: FileUploadOpts): Promise<File> {
    return this.service.upload(stream, options);
  }

  async exists(fileId: string): Promise<boolean> {
    return this.service.exists(fileId);
  }

  async remove(fileId: string): Promise<void> {
    return this.service.remove(fileId);
  }

  async get(id: string, opts: FileOpts): Promise<File> {
    const file = await this.service.get(id);
    if (!opts || (file.contentType !== 'image/jpeg' && file.contentType !== 'image/png')) {
      return file;
    }
    const { width, height } = opts ?? {};
    const targetId = Files.getFileId(id, width, height);
    if (await this.service.exists(targetId)) {
      return this.service.get(targetId);
    }
    if (!await this.service.exists(id)) {
      throw new Error('File not found');
    }
    const t = sharp().resize(width, height);
    await this.service.upload(file.getStream().pipe(t).on('error', (err: Error) => {
      throw err;
    }), {
      id: targetId,
      originalname: file.metadata.filename,
      mimetype: file.contentType,
    });
    return this.service.get(targetId);
  }
}

export const initStorage = (config: Config) => new Files(config);
