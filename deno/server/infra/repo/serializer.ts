import { EntityId } from "../../types.ts";
import { ObjectId } from "./db.ts";

function recursiveDeserialize(obj: any): any {
  if (obj instanceof EntityId) {
    return EntityId.from(obj);
  } else if (obj instanceof ObjectId) {
    return EntityId.from(obj.toHexString());
  } else if (Array.isArray(obj)) {
    return obj.map(recursiveDeserialize);
  } else if (typeof obj === "object") {
    for (const key in obj) {
      obj[key] = recursiveDeserialize(obj[key]);
    }
    if (obj && obj._id) {
      obj.id = obj._id;
      delete obj._id;
    }
  }
  return obj;
}

export function deserialize(data: any) {
  return recursiveDeserialize(data);
}

function recursiveSerialize(obj: any): any {
  if (obj instanceof EntityId) {
    return new ObjectId(obj.value);
  } else if (Array.isArray(obj)) {
    return obj.map(recursiveSerialize);
  } else if (typeof obj === "object") {
    for (const key in obj) {
      obj[key] = recursiveSerialize(obj[key]);
    }
    if (obj && obj.id) {
      obj._id = obj.id;
      delete obj.id;
    }
  }
  return obj;
}

export function serialize(data: any) {
  return recursiveSerialize(data);
}
