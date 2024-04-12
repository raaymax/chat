import {createMethod} from '../store';

export const load = createMethod('users/load', async (_arg, {actions, client}) => {
  const res = await client.req({ type: 'user:getAll' });
  actions.users.add(res.data);
});
