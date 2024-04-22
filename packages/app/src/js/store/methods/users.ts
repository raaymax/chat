import {createMethod} from '../store';

export const load = createMethod('users/load', async (_arg, {actions, client, dispatch}) => {
  const res = await client.req({ type: 'user:getAll' });
  dispatch(actions.users.add(res.data));
});
