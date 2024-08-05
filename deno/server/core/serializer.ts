import { EntityId } from "../types.ts";

export function serialize<A>(obj: A): any {
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


