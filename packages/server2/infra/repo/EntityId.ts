import { ObjectId } from "./db.ts";


export class EntityId {
  constructor(public value: string ) {}

  static from(id: string | ObjectId | EntityId) {
    if (id instanceof EntityId) {
      return new EntityId(id.toString());
    } else if (id instanceof ObjectId) {
      return new EntityId(id.toHexString());
    } else if (typeof id === 'string') {
      return new EntityId(id);
    } else {
      console.log(id);
      throw new Error('Invalid id type');
    }
  }

  toString() {
    return this.value;
  }

  serialize() {
    return new ObjectId(this.value);
  }
}
  
