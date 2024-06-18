import { connect, ObjectId} from './db.ts';
import { deserialize, serialize } from './serializer.ts';
import { User} from '../../types.ts';


class UserRepo {
  async get(q: Partial<User>): Promise<User | null> {
    if(!q) return null;
    const { db } = await connect();
    const user = await db.collection('users').findOne(serialize(q));
    return deserialize(user);
  }
}


export const user = new UserRepo();
