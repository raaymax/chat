import {insertUser} from '../store/users';
import { client } from '../core';

export const loadUsers = async () => {
  client.on('user', (c, msg) => insertUser(msg));
  await client.req({type: 'users'});
}
