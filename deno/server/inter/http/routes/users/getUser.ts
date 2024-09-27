import { ResourceNotFound, Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/:userId",
    handler: async (req) => {
      const user = await core.user.get({ id: req.params.userId });
      if (!user) {
        throw new ResourceNotFound("User not found");
      }
      delete user.password;
      delete user.mainChannelId;
      return Response.json(user);
    },
  });
