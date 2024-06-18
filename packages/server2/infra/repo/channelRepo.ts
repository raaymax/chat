import { connect, ObjectId } from './db.ts';
import { deserialize, serialize } from './serializer.ts';
import { EntityId, Channel } from '../../types.ts';


type ChannelQuery = Partial<Channel & {userId: EntityId}>;
class ChannelRepo {
  COLLECTION = 'channels';
  
  makeQuery(data: ChannelQuery) {
    const {userId, ...rest} = serialize(data);
    return {
      ...rest,
      ...(userId ? { users: { $elemMatch: { $eq: userId } } } : {}),
    }
  }

  async create(data: Partial<Channel>): Promise<EntityId> {
    const { db } = await connect();
    //console.log('save', data);
    const ret = await db.collection(this.COLLECTION).insertOne(serialize(data));
    return deserialize(ret.insertedId);
  }

  async remove(data: ChannelQuery): Promise<void> {
    const { db } = await connect();
    const query = this.makeQuery(data);
    if (!query.id) return;
    await db.collection(this.COLLECTION).deleteOne(query);
  }

  async get(data: ChannelQuery): Promise<Channel | null> {
    if(!data) return null;
    const { db } = await connect();
    const query = this.makeQuery(data);
    //console.log('query', query);
    //console.log(await db.collection(this.COLLECTION).deleteMany({}));
    //console.log(await db.collection(this.COLLECTION).find().toArray());
    const channel = await db.collection(this.COLLECTION).findOne(query);
    return deserialize(channel);
  }

  async getAll(data: ChannelQuery): Promise<Channel[]> {
    if(!data) return [];
    const { db } = await connect();
    const query = this.makeQuery(data);
    const session = await db.collection(this.COLLECTION).find(query).toArray();
    return session.map(deserialize);
  }
}

export const channel = new ChannelRepo();
