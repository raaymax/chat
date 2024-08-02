import { Planigale, Res, ApiError, InternalServerError } from '@planigale/planigale';

export const allowCors = (app: Planigale) => {
  app.use(async (req, next) => {
    try {
      const res = await Res.makeResponse(await next());
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
      } else {
        const err = new InternalServerError(e); // FIXME: Not all errors will be internal server errors
        err.headers["Access-Control-Allow-Origin"] = req.headers["origin"] || "*";
        err.headers["Access-Control-Allow-Headers"] = req.headers["access-control-request-headers"] || "Authorization";
        err.headers["Access-Control-Allow-Methods"] = req.headers["access-control-request-method"] || "GET, POST, PUT, DELETE, OPTIONS";
        err.headers["Access-Control-Allow-Credentials"] = "true";
        throw err;
      }
    }
  });

  app.route({
    method: "OPTIONS",
    url: "*",
    public: true,

    handler: async function (req) {
      try{
        const res = new Res();
        res.status = 204;
        return res;
      } catch (e) {
        console.error(e);
        throw e;
      }
    }
  });
}
