import { Route } from "@planigale/planigale";
import { Core } from "../../../../core/mod.ts";

export default (core: Core) =>
  new Route({
    method: "GET",
    url: "/",
    handler: async () => Response.json(await core.emoji.getAll({})),
  });
