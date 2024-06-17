import * as v from 'valibot';
import { EntityId } from "../infra/mod.ts";

export type Command = {
  type: string;
  body: any;
}

export type Definition = {
  type: string,
  body: v.BaseSchema<any, any,any>,
}

export type InferCommandType<A extends Definition> = {
  type: A['type'],
  body: v.InferOutput<A['body']>,
}


function serialize(obj: any): any {
  if(obj instanceof EntityId) {
    return obj.toString();
  }
  if(Array.isArray(obj)) {
    return obj.map(serialize);
  }
  if(typeof obj === 'object') {
    for(const key in obj) {
      obj[key] = serialize(obj[key]);
    }
  }
  return obj;
}


export function createQuery<A extends Definition, B>(def: A, fn: (body: v.InferOutput<A['body']>) => Promise<B>) {
  const handler = async (body: v.InferInput<A['body']>) => {
    try {
      const args = v.parse(def.body, body);
      const ret = await fn(args);
      const r = serialize(ret);
      // console.log(`[QUERY: ${def.type}] Ret: `, r)
      return r;
    } catch(err) {
      console.log(`[QUERY: ${def.type}] Error:`)
      console.log(err);
      throw err;
    }
  }
  handler.def = def;
  handler.accepts = (evt: Command) => {
    return evt.type === def.type;
  }
  return handler;
}

export function createCommand<A extends Definition, B>(def: A, fn: (body: v.InferOutput<A['body']>) => Promise<B>) {
  const handler = async (evt: Command) => {
    try{
      const body = v.parse(def.body, evt.body);
      const ret = await fn(body);
      const r = serialize(ret);
      //console.log(`[COMMAND: ${def.type}] Ret: `, r)
      return r;
    }catch(err) {
      console.log(`[COMMAND: ${def.type}] Error:`)
      console.log(err);
      throw err;
    }
  } 
  handler.def = def;
  handler.accepts = (evt: Command) => {
    return evt.type === def.type;
  }
  return handler;
}
