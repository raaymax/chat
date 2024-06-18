import { connect, ObjectId } from './db.ts';
import { deserialize, serialize } from './serializer.ts';
import { EntityId, Session } from '../../types.ts';


class SessionRepo {
  #generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  async create(data: {userId: EntityId}): Promise<EntityId> {
    const { db } = await connect();
    const newSession = serialize({
      userId: data.userId,
      token: this.#generateToken(),
    });
    const ret = await db.collection('sessions').insertOne(newSession);
    return deserialize(ret.insertedId);
  }

  async remove(data: { id?: EntityId}): Promise<void> {
    const { db } = await connect();
    const { id } = data;
    if (!id) return;
    await db.collection('sessions').deleteOne(serialize(data));
  }

  async get(data: Partial<Session>): Promise<Session | null> {
    if(!data) return null;
    const { db } = await connect();
    const session = await db.collection('sessions').findOne(serialize(data));
    return deserialize(session);
  }

}

export const session = new SessionRepo();
