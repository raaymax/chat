import Repo from '../repo';
import { User, UserQuery, MongoUser } from './userTypes';
import { UserSerializer } from './userSerializer';

export class UserRepo extends Repo<UserQuery, User, MongoUser> {
  constructor() {
    super('users', new UserSerializer());
  }
}
