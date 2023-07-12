export { Config } from '@quack/config';

export type FileOpts = { width: number, height: number };
export type FileUploadOpts= { originalname: string, mimetype: string, id: string };

export type File = {
  fileId: string,
  contentType: string,
  contentDisposition: string,
  metadata: {
    filename: string,
    [key: string]: any,
  },
  getStream: () => NodeJS.ReadableStream,
}

export interface Storage {
  upload(stream: NodeJS.ReadableStream, options?: FileUploadOpts) : Promise<File>;
  get(fileId: string, options?: FileOpts) : Promise<File>;
  exists(fileId: string) : Promise<boolean>;
  remove(fileId: string) : Promise<void>;
}
