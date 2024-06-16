import { ObjectId } from './db.ts';

function replaceAllObjectIds(obj: any): any {
  if (obj instanceof ObjectId) {
    return obj.toHexString();
  }
  if (Array.isArray(obj)) {
    return obj.map(replaceAllObjectIds);
  }
  if (typeof obj === 'object') {
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
