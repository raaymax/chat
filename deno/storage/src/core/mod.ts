import sharp from "sharp";
import { Config } from "@quack/config";
import { toNodeStream, toWebStream } from "./streams.ts";
import { FileData, FileOpts } from "./types.ts";
import { files } from "./store/mod.ts";

type ScalingOpts = {
  width?: number;
  height?: number;
};

class Files {
  static getFileId = (id: string, width: number, height: number) =>
    `${id}-${width}x${height}`;

  private service: any;

  constructor(config: Config) {
    this.init(config.storage);
  }

  init(config: Config["storage"]) {
    this.service = files(config);
  }

  async upload(
    stream: ReadableStream<Uint8Array>,
    options: FileOpts,
  ): Promise<string> {
    return this.service.upload(stream, options);
  }

  async exists(fileId: string): Promise<boolean> {
    return this.service.exists(fileId);
  }

  async remove(fileId: string): Promise<void> {
    return this.service.remove(fileId);
  }

  async get(id: string, opts?: ScalingOpts): Promise<FileData> {
    const file = await this.service.get(id);
    if (!file) {
      throw new Error("File not found");
    }
    if (
      !opts ||
      (file.contentType !== "image/jpeg" && file.contentType !== "image/png")
    ) {
      return file;
    }
    const { width, height } = opts ?? {};
    if (!width || !height) {
      return file;
    }
    const targetId = Files.getFileId(id, width, height);
    if (await this.service.exists(targetId)) {
      return this.service.get(targetId);
    }

    await this.service.upload(
      toWebStream(
        toNodeStream(file.stream).pipe(sharp().resize(width, height)),
      ),
      {
        id: targetId,
        filename: file.filename,
        contentType: file.contentType,
      },
    );
    return this.service.get(targetId);
  }
}

export type Storage = Files;

export const initStorage = (config: Config) => new Files(config);
