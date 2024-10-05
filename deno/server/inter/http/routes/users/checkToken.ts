import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/token/:token",
    public: true,
    schema: {
      params: {
        type: "object",
        required: ["token"],
        properties: {
          token: { type: "string" },
        },
      },
    },
    handler: async (req) => {
      const valid = await core.user.checkToken({ token: req.params.token});
      return Res.json({valid});
    },
  });
