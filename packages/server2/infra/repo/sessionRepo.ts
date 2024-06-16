import { connect, ObjectId } from './db.ts';
import { deserialize } from './helpers.ts';

class SessionRepo {
  #generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  async create(data: {userId: string}) {
    const { db } = await connect();

    const newSession = {
      userId: data.userId,
      token: this.#generateToken(),
    };
    const ret = await db.collection('sessions').insertOne(newSession);
    return ret.insertedId.toHexString();
  }

  async remove(data: { id?: string }) {
    const { db } = await connect();
    const { id } = data;
    if (!id) return;
    await db.collection('sessions').deleteOne({ _id: new ObjectId(id) });
  }

  async get(data: {id?: string, userId?: string, token?: string}) {
    const { db } = await connect();
    const {id, ...query} = data;
    const _id = id ? { _id: new ObjectId(id) } : {};
    const session = await db.collection('sessions').findOne({..._id, ...query});
    return deserialize(session);
  }

}

export const session = new SessionRepo();
