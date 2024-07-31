export type FileOpts = {
  id?: string;
  contentType: string;
  filename: string;
  size?: number;
};

export type FileData = {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  stream: ReadableStream<Uint8Array>;
};
