import { client } from '../core';
import { actions } from '../state';
import { logErrors } from './logger';

export const loadUsers = () => logErrors(async (dispatch) => {
  const res = await client.req({type: 'users:load'});
  res.data.forEach((usr) => {
    dispatch(actions.addUser(usr))
  })
});
