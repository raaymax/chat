import * as v from "valibot";
import { EntityId } from "../types.ts";
import type { Core } from "./core.ts";

function serialize<A>(obj: A): any {
  if (obj instanceof EntityId) {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(serialize);
  }
  if (typeof obj === "object") {
    for (const key in obj) {
      obj[key] = serialize(obj[key]);
    }
  }
  return obj;
}

export type Definition<
  T extends string,
  U extends v.BaseSchema<any, any, any>,
> = {
  type: T;
  body: U;
};

export type Handler<U extends v.BaseSchema<any, any, any>> = (
  body: v.InferOutput<U>,
  core: Core,
) => Promise<void | EntityId | null>;

export type Command<T extends string, U extends v.BaseSchema<any, any, any>> = {
  type: T;
  def: Definition<T, U>;
  handler: (
    evt: v.InferInput<U>,
    core: Core,
  ) => Promise<void | EntityId | null>;
};

export function createCommand<
  T extends string,
  U extends v.BaseSchema<any, any, any>,
>(def: Definition<T, U>, fn: Handler<U>): Command<T, U> {
  return {
    type: def.type,
    def,
    handler: async (rawbody: v.InferInput<U>, core: Core) => {
      try {
        const body = v.parse(def.body, rawbody);
        const ret = await fn(body, core);
        const r = serialize(ret);
        //console.log(`[COMMAND: ${def.type}] Ret: `, r)
        return r;
      } catch (err) {
        console.log(`[COMMAND: ${def.type}] Error:`);
        console.log(err);
        throw err;
      }
    },
  };
}

export type CommandDirectory<T extends { type: string }[]> = {
  [K in T[number]["type"]]: Extract<T[number], { type: K }>;
};

export function buildCommandCollection<T extends { type: string }[]>(
  events: T,
): CommandDirectory<T> {
  return events.reduce((acc, curr) => {
    acc[curr.type] = curr;
    return acc;
  }, {} as any);
}

export type EventFrom<T> = T extends Command<infer T, infer U>
  ? { type: T; body: v.InferInput<U> }
  : never;

const Ev1 = createCommand({
  type: "ev1",
  body: v.string(),
}, async (_a: string): Promise<void> => {
});

const Ev2 = createCommand({
  type: "ev2",
  body: v.number(),
}, async (_a: number): Promise<void> => {
});
const collection = buildCommandCollection([Ev1, Ev2]);

type Event = EventFrom<typeof collection[keyof typeof collection]>;

const dispatch = (event: Event) => {
  return (collection[event.type] as any).handler(event.body);
};

dispatch({ type: "ev1", body: "asd" });
