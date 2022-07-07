import { client } from '../core';

export const loadUsers = () => async () => client.req({type: 'users'});
