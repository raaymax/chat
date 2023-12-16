import { Id, Serializer } from './types';
import { connect } from './db';

export default class Repo<Query, Model, MongoModel> {
  // eslint-disable-next-line no-useless-constructor
  constructor(protected tableName: string, protected serializer: Serializer<Query, Model, MongoModel>) {
    // empty
  }

  async get(arg: Query): Promise<Model> {
    const { db } = await connect();
    return db
      .collection<MongoModel>(this.tableName)
      .findOne(this.serializer.serializeQuery(arg))
      .then(this.serializer.deserializeModel);
  }

  async getAll(query?: Query): Promise<Array<Model>> {
    const { db } = await connect();
    return db.collection<MongoModel>(this.tableName)
      .find(this.serializer.serializeQuery(query))
      .toArray()
      .then((r) => this.serializer.deserializeModelMany(r));
  }

  async create(data: Model): Promise<Id> {
    const { db } = await connect();
    return db.collection(this.tableName)
      .insertOne(this.serializer.serializeModel(data))
      .then(this.serializer.deserializeInsertedId);
  }

  async createMany(data: Model[]): Promise<Id[]> {
    return Promise.all(data.map((d) => this.create(d)));
  }

  async update(query: Query, data: Model, type = 'set') {
    const { db } = await connect();
    return db.collection(this.tableName)
      .updateOne(
        this.serializer.serializeQuery(query),
        { [`$${type}`]: this.serializer.serializeModel(data) },
      );
  }

  async updateMany(query: Query, data: Model, type = 'set') {
    const { db } = await connect();
    return db.collection(this.tableName)
      .updateMany(
        this.serializer.serializeQuery(query),
        { [`$${type}`]: this.serializer.serializeModel(data) },
      );
  }

  async remove(query: Query) {
    const { db } = await connect();
    return db.collection(this.tableName)
      .deleteOne(this.serializer.serializeQuery(query));
  }

  async removeMany(query: Query) {
    const { db } = await connect();
    return db.collection(this.tableName)
      .deleteMany(this.serializer.serializeQuery(query));
  }

  async count(query: Query) {
    const { db } = await connect();
    return db.collection(this.tableName)
      .count(this.serializer.serializeQuery(query));
  }
}
