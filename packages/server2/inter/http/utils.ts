import { Router, Context } from '@oak/oak';
import * as v from "valibot";
import { EndpointDefinition, Request, Response } from "./types.ts";
import type { Core } from '../../core/mod.ts'


export function createEndpoint<
  B extends v.BaseSchema<any, any, any>,
  P extends v.BaseSchema<any, any, any>,
  Q extends v.BaseSchema<any, any, any>
>(factory: (args: {core: Core}) => EndpointDefinition<B, P, Q>) {
  return (args: {core: Core}) => {
    const def = factory(args);
    return (router: Router) => {
      def.middleware = def.middleware || [];
      (router[def.method.toLowerCase() as keyof Router] as any)(def.url, async (ctx: Context) => {
        if(def.auth && !ctx.state.user) {
          ctx.response.status = 401;
          ctx.response.body = { message: 'Unauthorized' };
          return;
        }
        const req: Request<v.InferOutput<B>, v.InferOutput<P>, v.InferOutput<Q>> = {
          ctx,
          get core() {
            return ctx.state.core;
          },
          get state() {
            return ctx.state;
          },
          get session() {
            return ctx.state.session;
          },
          get cookies() {
            return ctx.cookies;
          },
          body: {},
          params: {},
          query: {},
        }
        const res: Response = {
          send: (data: any) => {
            ctx.response.body = data;
          }
        }
        try {
          req.body = def.schema?.body && v.parse(def.schema.body, await ctx.request.body.json());
        } catch(err) {
          return sendValidationError('body', ctx, err);
        }
        const query = Object.fromEntries(ctx.request.url.searchParams.entries());
        try {
          req.params = def.schema?.params && v.parse(def.schema.params, (ctx as {params?: unknown}).params);
        } catch(err) {
          return sendValidationError('params', ctx, err);
        }
        try {
          req.query = def.schema?.query && v.parse(def.schema.query, query);
        } catch(err) {
          return sendValidationError('query', ctx, err);
        }
        try {
          await def.handler(req, res);
        } catch (err) {
          throw err;
        }
      });
    }
  }
}

function sendValidationError(group: string, ctx: any, err: any){
  if(err.name === 'ValiError') {
    ctx.response.body = err.issues.map((issue: any) => ({
      message: issue.message,
      path: group + issue.path.reduce((acc: string, p: {key: string}) => `${acc}.${p.key}`, '')
    }));
    ctx.response.status = 400;
    return;
  }else{
    throw err;
  }
}
