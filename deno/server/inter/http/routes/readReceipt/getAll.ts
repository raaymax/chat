import { Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/read-receipts",
    public: false,
    handler: async (req) => {
      const userId = req.state.user.id;
      const results = await core.readReceipt.getAll({ userId });
      return Response.json(results);
    },
  });
