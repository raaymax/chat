import {
  ApiError,
  InternalServerError,
  Planigale,
  Res,
} from "@planigale/planigale";

export const allowCors = (app: Planigale) => {
  app.use(async (req, next) => {
    try {
      const a = await next();
      const res = await Res.makeResponse(a);
      const headers = new Headers(res.headers);
      headers.set("Access-Control-Allow-Origin", req.headers["origin"] || "*");
      headers.set(
        "Access-Control-Allow-Headers",
        req.headers["access-control-request-headers"] || "*",
      );
      headers.set(
        "Access-Control-Allow-Methods",
        req.headers["access-control-request-method"] || "*",
      );
      headers.set("Access-Control-Allow-Credentials", "true");
      return new Response(res.body, { headers });
    } catch (e) {
      if (e instanceof ApiError) {
        e.headers["Access-Control-Allow-Origin"] = req.headers["origin"] || "*";
        e.headers["Access-Control-Allow-Headers"] =
          req.headers["access-control-request-headers"] || "*";
        e.headers["Access-Control-Allow-Methods"] =
          req.headers["access-control-request-method"] || "*";
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
};
