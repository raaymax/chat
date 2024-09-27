import { Database } from "./db.ts";
import { deserialize, serialize } from "./serializer.ts";
import { EntityId } from "../../types.ts";

export class Repo<Query, Model> {
  COLLECTION: string = "";

  constructor(private db: Database) {}

  get connect() {
    return this.db.connect;
  }

  makeQuery(data: Query) {
    const query = serialize(data);
    return query;
  }

  async create(data: Partial<Model>): Promise<EntityId> {
    const { db } = await this.connect();
    // console.log('save', serialize(data));
    const ret = await db.collection(this.COLLECTION).insertOne(serialize(data));
    return deserialize(ret.insertedId);
  }

  async createMany(data: Model[]): Promise<EntityId[]> {
    return Promise.all(data.map((d) => this.create(d)));
  }

  async update(query: Query, data: Partial<Model>, type = "set") {
    const { db } = await this.connect();
    return db.collection(this.COLLECTION)
      .updateOne(
        this.makeQuery(query),
        { [`$${type}`]: serialize(data) },
      );
  }

  async updateMany(query: Query, data: Partial<Model>, type = "set") {
    const { db } = await this.connect();
    return db.collection(this.COLLECTION)
      .updateMany(
        this.makeQuery(query),
        { [`$${type}`]: serialize(data) },
      );
  }

  async remove(data: Query): Promise<void> {
    const { db } = await this.connect();
    const query = this.makeQuery(data);
    if (!query._id) return;
    await db.collection(this.COLLECTION).deleteOne(query);
  }

  async removeMany(query: Query) {
    const { db } = await this.connect();
    return db.collection(this.COLLECTION)
      .deleteMany(this.makeQuery(query));
  }

  async get(data: Query): Promise<Model | null> {
    if (!data) return null;
    const { db } = await this.connect();
    const query = this.makeQuery(data);
    // console.log('query', query);
    // console.log(await db.collection(this.COLLECTION).deleteMany({}));
    // console.log(await db.collection(this.COLLECTION).find().toArray());
    const item = await db.collection(this.COLLECTION).findOne(query);
    return deserialize(item);
  }

  async getAll(data: Query): Promise<Model[]> {
    if (!data) return [];
    const { db } = await this.connect();
    const query = this.makeQuery(data);
    const items = await db.collection(this.COLLECTION).find(query).toArray();
    return deserialize(items);
  }
  async count(data: Query) {
    const { db } = await this.connect();
    const query = this.makeQuery(data);
    return db.collection(this.COLLECTION)
      .countDocuments(query);
  }
}
