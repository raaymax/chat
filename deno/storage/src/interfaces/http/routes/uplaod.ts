import { Route } from "@planigale/planigale";
import type { Storage } from "../../../core/mod.ts";

export const upload = (storage: Storage) =>
  new Route({
    method: "POST",
    url: "/",
    handler: async (req) => {
      const id = await storage.upload(req.body, {
        filename: req.headers["content-disposition"].split("filename=")[1]
          .replace(/"/g, ""),
        size: parseInt(req.headers["content-length"] ?? 0, 10),
        contentType: req.headers["content-type"],
      });
      return Response.json({ status: "ok", id });
    },
  });
