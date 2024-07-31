import { Config } from "@quack/config";
import { ResourceNotFound } from "@planigale/planigale";
import { FileData, FileOpts } from "../types.ts";

function* idGenerator(): Generator<string> {
  let id = 0;
  while (true) {
    yield `f-${id++}`;
  }
}

interface InternalFileData {
  id: string;
  file: File;
  filename: string;
  contentType: string;
  size: number;
}

export const files = (config: Config["storage"]) => {
  const generator = idGenerator();
  const memory = new Map<string, InternalFileData>();
  return {
    upload: async (
      stream: ReadableStream<Uint8Array>,
      options: FileOpts,
    ): Promise<string> => {
      let data = new Uint8Array();
      let size = 0;
      for await (const chunk of stream) {
        size += chunk.length;
        data = new Uint8Array([...data, ...chunk]);
      }
      if (options.size && size !== options.size) {
        throw new Error("Size mismatch");
      }
      const file = new File([data], options.filename, {
        type: options.contentType,
        lastModified: Date.now(),
      });
      const id: string = options.id ?? generator.next().value;
      memory.set(id, {
        id,
        file,
        filename: options.filename,
        contentType: options.contentType,
        size,
      });
      return id;
    },
    get: async (id: string): Promise<FileData> => {
      const file = memory.get(id);
      if (!file) {
        throw new ResourceNotFound("File not found");
      }

      return {
        ...file,
        get stream() {
          return file.file.stream();
        },
      };
    },
    remove: async (id: string): Promise<void> => {
      memory.delete(id);
    },
    exists: async (id: string): Promise<boolean> => memory.has(id),
  };
};
