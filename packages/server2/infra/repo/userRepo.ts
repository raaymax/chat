import { connect, ObjectId} from './db.ts';
import { deserialize, serialize } from './helpers.ts';


class UserRepo {
  async get(q: any) {
    const { db } = await connect();
    const user = await db.collection('users').findOne(serialize(q));
    if(!user) {
      await db.collection('users').insertOne({
        login: 'admin',
        password: 'pass123',
        name: 'Admin',
      });
      return;
    }
    return deserialize(user);
  }
}


export const user = new UserRepo();
