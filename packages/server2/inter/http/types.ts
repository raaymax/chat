import { Context, Next } from '@oak/oak';
import { Core } from '../../core/mod.ts';
import * as v from 'valibot';

export type { Context, Router, Application, Route, Next } from '@oak/oak';

export type Request<B,P,Q> = {
  ctx: Context;
  core: Core;
  state: Context['state'];
  userId: string;
  session: Record<string, any>;
  cookies: Context['cookies'];
  body?: B,
  params?: P,
  query?: Q,
}

export type Response = {
  send: (data: any) => void;
}

export type Middleware<B, P, Q> = (req: Request<B, P, Q>, res: Response, next: Next) => Promise<any>;

export type EndpointDefinition<B extends v.BaseSchema<any, any, any>, P extends v.BaseSchema<any, any, any>, Q extends v.BaseSchema<any, any, any>> = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD',
  url: string,
  auth?: boolean,
  schema: {
    body?: B,
    params?: P,
    query?: Q,
    response?: any
  },
  middleware?: Middleware<v.InferOutput<B>, v.InferOutput<P>, v.InferOutput<Q>>[],
  handler: (req: Request<v.InferOutput<B>, v.InferOutput<P>, v.InferOutput<Q>>, res: Response) => Promise<any>,
}

