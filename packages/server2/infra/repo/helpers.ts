import { EntityId } from './EntityId.ts';
import { ObjectId } from "./db.ts";

function replaceAllObjectIds(obj: any): any {
  if (obj instanceof EntityId) {
    return EntityId.from(obj);
  } else if (obj instanceof ObjectId) {
    return EntityId.from(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(replaceAllObjectIds);
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      obj[key] = replaceAllObjectIds(obj[key]);
    }
  }
  return obj;
}

function replaceId(obj: any) {
  if (obj && obj._id) {
    obj.id = obj._id;
    delete obj._id;
  }
  return obj;
}

export function deserialize(data: any) {
  return replaceId(replaceAllObjectIds(data));
}



function serializeId(obj: any) {
  if (obj && obj.id) {
    obj._id = obj.id;
    delete obj.id;
  }
  return obj;
}

function recursiveSerialize(obj: any):any {
  if (obj instanceof EntityId) {
    return obj.serialize();
  } else if (Array.isArray(obj)) {
    return obj.map(recursiveSerialize);
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      obj[key] = recursiveSerialize(obj[key]);
    }
  }
  return obj;
}
  

export function serialize(data: any) {
  return serializeId(recursiveSerialize(data));
}
