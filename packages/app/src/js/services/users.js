import {insertUser} from '../store/users';

export const loadUsers = async (client) => {
  client.on('user', (c, msg) => insertUser(msg));
  await client.req({type: 'users'});
}
