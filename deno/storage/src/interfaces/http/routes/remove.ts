import { Res, Route } from "@planigale/planigale";
import type { Storage } from "../../../core/mod.ts";

export const remove = async (storage: Storage) =>
  new Route({
    method: "DELETE",
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
    },
    handler: async (req) => {
      await storage.remove(req.params.fileId);
      const res = new Res();
      res.status = 204;
      return res;
    },
  });
