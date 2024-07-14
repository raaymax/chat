import { Core } from "../../../../core/mod.ts";
import { Route } from '@codecat/planigale';

export default (core: Core) => new Route({
  method: "POST",
  url: "/",
  auth: true,
  schema: {
  },
  handler: async (req, res) => {
    console.log(req);
    res.send({ status: 'ok', fileId: req.state.file.fileId });
  }
});
