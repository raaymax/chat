import { client } from '../core';
import { actions } from '../state';

export const loadUsers = () => async (dispatch) => {
  try {
    const res = await client.req({ type: 'users:load' });
    res.data.forEach((usr) => {
      dispatch(actions.addUser(usr));
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};
