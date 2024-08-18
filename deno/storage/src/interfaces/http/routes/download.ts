import { Res, Route } from "@planigale/planigale";
import type { Storage } from "../../../core/mod.ts";

export const download = (storage: Storage) =>
  new Route({
    method: "GET",
    url: "/:fileId",
    schema: {
      params: {
        type: "object",
        required: ["fileId"],
        properties: {
          fileId: {
            type: "string",
          },
        },
      },
      query: {
        type: "object",
        properties: {
          w: {
            type: "number",
          },
          h: {
            type: "number",
          },
        },
      },
    },
    handler: async (req) => {
      const file = await storage.get(req.params.fileId, {width: req.query.w, height: req.query.h});
      console.log(file);
      const res = new Res();
      res.body = file.stream;
      res.headers.set("Content-Type", file.contentType);
      res.headers.set("Content-Length", file.size.toString());
      res.headers.set(
        "Content-Disposition",
        `attachment; filename="${file.filename}"`,
      );
      return res;
    },
  });
