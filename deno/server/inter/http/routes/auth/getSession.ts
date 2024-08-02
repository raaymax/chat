import { Res, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (_core: Core) =>
  new Route({
    public: true,
    method: "GET",
    url: "/session",
    handler: async (req) => {
      if (req.state.session) {
        return Res.json({
          ...req.state.session,
          user: req.state.user.id, // FIXME: remove
          status: "ok", // FIXME: remove
        });
      } else {
        return Res.json({ status: "no-session" });
      }
    },
  });
