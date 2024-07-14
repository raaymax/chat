import { Route } from '@codecat/planigale';
import { Core } from "../../../../core/mod.ts";

export default (_core: Core) => new Route({
  method: "GET",
  url: "/sse",
  handler: async (req, res) => {
    const target = res.sendEvents();

    setTimeout(() => {
      target.sendMessage({ data: "hello" });
      target.close();
    }, 1);
  }
});
