import * as v from 'valibot';

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

export function createCommandHandler<A extends Definition, B>(def: A, fn: (body: v.InferOutput<A['body']>) => Promise<B>) {
  const handler = (evt: Command) => {
    if (evt.type !== def.type) return;
    try{
      const body = v.parse(def.body, evt.body);
      return fn(body);
    }catch(err) {
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
