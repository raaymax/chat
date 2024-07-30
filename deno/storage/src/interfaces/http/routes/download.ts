import { Route, Res } from '@planigale/planigale';
import type { Storage } from '../../../core/mod.ts';

export const download = async (storage: Storage) =>  new Route({
  method: "GET",
  url: "/:fileId",
  schema: {
    params: {
      type: "object",
      required: ["fileId"],
      properties: {
        fileId: {
          type: "string",
        }
      }
    },
    query: {
      type: "object",
      properties: {
        width: {
          type: "number",
        },
        height: {
          type: "number",
        },
      }
    }
  },
  handler: async (req) => {
    const file = await storage.get(req.params.fileId, req.query);
    const res = new Res();
    res.body = file.stream;
    res.headers.set('Content-Type', file.contentType);
    res.headers.set('Content-Length', file.size.toString());
    res.headers.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    return res;
  }
});
