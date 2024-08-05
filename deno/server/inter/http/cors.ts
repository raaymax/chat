import { Planigale, Res, ApiError, InternalServerError } from '@planigale/planigale';

export const allowCors = (app: Planigale) => {
  app.use(async (req, next) => {
    try {
      const a = await next();
      const res = await Res.makeResponse(a);
      res.headers.set("Access-Control-Allow-Origin", req.headers["origin"] || "*");
      res.headers.set("Access-Control-Allow-Headers", req.headers["access-control-request-headers"] || "*");
      res.headers.set("Access-Control-Allow-Methods", req.headers["access-control-request-method"] || "*");
      res.headers.set("Access-Control-Allow-Credentials", "true");
      return res;
    } catch (e) {
      if (e instanceof ApiError) {
        e.headers["Access-Control-Allow-Origin"] = req.headers["origin"] || "*";
        e.headers["Access-Control-Allow-Headers"] = req.headers["access-control-request-headers"] || "*";
        e.headers["Access-Control-Allow-Methods"] = req.headers["access-control-request-method"] || "*";
        e.headers["Access-Control-Allow-Credentials"] = "true";
        throw e;
      }
      throw e;
    }
  });

  app.route({
    method: "OPTIONS",
    url: "*",
    public: true,
    handler: () => Res.empty(),
  });
}
