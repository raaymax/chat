import { client } from '../core';

export const loadUsers = () => async () => {
  try {
    const res = await client.req2({type: 'users'});
    res.data.forEach((usr) => {
      dispatch(actions.addUser(usr))
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};
