
import { Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";
import { User } from "../../../../types.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/",
    handler: async () => {
      const users = await core.user.getAll({});
      return Response.json(users.map((u: Partial<User>) => {
        delete u.password;
        delete u.mainChannelId;
        return u;
      }));
    },
  });
