import {JSONSchema7} from 'npm:@types/json-schema';
import {Ajv, JSONSchemaType} from "npm:ajv"
import qs from 'npm:qs';

type Next = () => void | Promise<void>;
type Handler = (req: Req, res: Res, next: Next) => void | Promise<void>;

type RouteDef = {
  method: string | string[];
  url: string;
  auth?: boolean;
  schema?: {
    body?: JSONSchema7;
    params?: JSONSchema7;
    query?: JSONSchema7;
    headers?: JSONSchema7;
    response?: any;
  };
  handler: Handler;
}

class Route {
  method: string[] = [];
  pattern: URLPattern;
  validation: {
    body?: any,
    params?: any,
    query?: any,
    headers?: any,
  } = {};
  handler: Handler;

  static fromDef(def: RouteDef, app: Application) {
    const route = new Route(
      [def.method].flat(),
       new URLPattern({ pathname: def.url }),
       def.handler,
    );
    route.validation = {
      body: def.schema?.body ? app.ajv.compile(def.schema.body) : undefined,
      params: def.schema?.params ? app.ajv.compile(def.schema.params) : undefined,
      query: def.schema?.query ? app.ajv.compile(def.schema.query) : undefined,
      headers: def.schema?.headers ? app.ajv.compile(def.schema.headers) : undefined,
    };
    return route;
  }
  match(request: Request) {
    return this.pattern.test(request.url) && 
      this.method.includes(request.method);
  }

  async validate(req: any) {
    let errors: any = await Promise.all([
      this.#validateBlock('body', req),
      this.#validateBlock('params', req),
      this.#validateBlock('query', req),
      this.#validateBlock('headers', req),
    ]);
    errors = errors.flat().filter((e: any) => e !== null);
    if(errors.length) {
      throw new ValidationFailed(errors);
    }
    return;
  }

  async #validateBlock(block: keyof Route['validation'], req: any) {
    if(this.validation[block]) {
      const validate = this.validation[block];
      const validationResult = validate(req[block]);

      if(validationResult instanceof Promise){
        try{ 
          await validationResult;
        }catch(e){
          return e.map((e: any) => ({...e, block: block}));
        }
      }else if(!validationResult) {
        return validate.errors.map((e: any) => ({...e, block: block}));
      }
    }
    return null
  }

  constructor(method: string[], pattern: URLPattern, handler: Handler) {
    this.method = method;
    this.pattern = pattern;
    this.handler = handler;
  }
}

class ValidationFailed extends Error {
  errors: any;
  constructor(errors: any) {
    super('Validation failed');
    this.errors = errors;
  }
}

class Req {
  ip: Deno.NetAddr | string = '';
  method: string;
  url: string;
  path: string;
  params: Record<string, any>;
  query: Record<string, any>;
  headers: Record<string, any>;
  body: any;
  state: {[key: string]: any} = {};

  static async from(pattern: URLPattern, request: Request, info?: Deno.ServeHandlerInfo) {
    const url = new URL(request.url);
    const urlMatch = pattern.exec(request.url);
    return new Req(request, {
      ip: info?.remoteAddr ?? "",
      path: urlMatch?.pathname.input ?? "",
      params: urlMatch?.pathname.groups ?? {},
      query: qs.parse(url.search.slice(1)),
      headers: Object.fromEntries(request.headers.entries()),
      body: request.body ? await request.json() : {},
    });
  }

  constructor(public request: Request, {
    ip, path, params, query, headers, body
  }: {
    ip: Deno.NetAddr | string,
    path: string,
    params: Record<string, any>,
    query: Record<string, any>,
    headers: Record<string, any>,
    body: any,

  } ) {
    this.ip = ip;
    this.method = request.method;
    this.url = request.url;
    this.path = path;
    this.params = params;
    this.query = query;
    this.headers = headers;
    this.body = body;
  }
}

class Res {
  body: any;
  status: number = 200;
  headers:Headers = new Headers( { "Content-Type": "application/json" });

  send(data: any) {
    this.body = data;
    return this;
  }

  serialize() {
    return new Response(JSON.stringify(this.body), {
      status: this.status,
      headers: this.headers,
    });
  }
}

export class Router {
  routes: Route[] = [];
  middlewares: Handler[] = [];
  find(req: Request) {
    const route = this.routes.find((route) => {
      return route.pattern.test(req.url) && 
        route.method.includes(req.method);
    });
    if (!route) {
      return null;
    }
    return {route, middlewares: this.middlewares};
  }

}

export class Application {
  routes: Route[] = [];
  middlewares: Handler[] = [];
  ajv = new Ajv({
    allErrors: true,
    useDefaults: true,
    coerceTypes: true,
  });

  use(handler: Handler) {
    this.middlewares.push(handler);
  }

  async handle(
    request: Request,
    info?: Deno.ServeHandlerInfo
  ): Promise<Response> {
    const route = this.routes.find((route) => route.match(request));
    if (!route) {
      const resp = new Response(new Blob(), {status: 404});
      return resp;
    }
    try {
      return await this.handleRoute(route, request, info);
    } catch(e) {
      if(e instanceof ValidationFailed) {
        return new Response(JSON.stringify(e.errors), {status: 400});
      }
      console.error(e);
      return new Response(JSON.stringify({messgae: "Internal Server Error"}), {status: 500});

    }
  }

  async handleRoute(route: Route, request: Request, info?: Deno.ServeHandlerInfo) {
    const req = await Req.from(route.pattern, request, info);
    await route.validate(req);
    const res = new Res();

    await this.middlewares.reduce<Next>((acc, middleware) => {
      return async () => await middleware(req, res, acc);
    }, async () => await route.handler(req, res, ()=>{}))();
    return res.serialize();
  }

  route(def: RouteDef) {
    const route: Route = Route.fromDef(def, this); 
    this.routes.push(route);
  }

  serve(opts: Deno.ServeOptions) {
    return Deno.serve(opts, this.handle.bind(this));
  }
};

