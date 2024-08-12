import * as v from "valibot";
import { EntityId } from "../types.ts";
import type { Core } from "./core.ts";
import { AppError } from "./errors.ts";
import { serialize } from "./serializer.ts";

export type Event = {
  type: string;
  body: any;
};
export type Definition = {
  type: string;
  body: v.BaseSchema<any, any, any>;
};

export function createQuery<A extends Definition, B>(
  def: A,
  fn: (body: v.InferOutput<A["body"]>, core: Core) => Promise<B>,
) {
  const handler = (core: Core) => async (body: v.InferInput<A["body"]>) => {
    try {
      const args = v.parse(def.body, body);
      const ret = await fn(args, core);
      const r = serialize(ret);
      //console.log(`[QUERY: ${def.type}] Ret: `, r)
      return r;
    } catch (err) {
      if (err instanceof AppError) {
        throw err;
      }
      console.log(`[QUERY: ${def.type}] Error:`);
      console.log(err);
      throw err;
    }
  };
  handler.def = def;
  handler.accepts = (evt: Event) => {
    return evt.type === def.type;
  };
  return handler;
}
