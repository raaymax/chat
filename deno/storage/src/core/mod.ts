import sharp from "sharp";
import type { Config } from "@quack/config";
import { toNodeStream, toWebStream } from "./streams.ts";
import type { FileData, FileOpts } from "./types.ts";
import { files } from "./store/mod.ts";

type ScalingOpts = {
  width?: number;
  height?: number;
};

class Files {
  static getFileId = (id: string, width = 0, height = 0) =>
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
    return await this.service.upload(stream, options);
  }

  async exists(fileId: string): Promise<boolean> {
    return await this.service.exists(fileId);
  }

  async remove(fileId: string): Promise<void> {
    return await this.service.remove(fileId);
  }

  async get(id: string, opts?: ScalingOpts): Promise<FileData> {
    const { width, height } = opts ?? {};
    const targetId = Files.getFileId(id, width, height);
    if (await this.service.exists(targetId)) {
      return this.service.get(targetId);
    }
    if (!await this.service.exists(id)) {
      throw new Error("FILE_NOT_FOUND");
    }

    const file = await this.service.get(id);
    if (
      !opts || !opts.width || !opts.height ||
      (file.contentType !== "image/jpeg" && file.contentType !== "image/png")
    ) {
      return file;
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
