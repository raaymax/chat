import {createMethod} from '../store';

export const load = createMethod('channels/load', async (_arg, {client, actions, dispatch}): Promise<void> => {
  const res = await client.req({ type: 'channel:getAll' });
  dispatch(actions.channels.add(res.data));
});

type Channel = {
  channelType?: 'DIRECT' | 'PRIVATE' | 'PUBLIC',
  name: string,
  users?: string[]
};
export const create = createMethod('channels/create', async ({channelType, name, users}: Channel, {client, actions, dispatch}) => {
  const res = await client.req({
    type: 'channel:create', channelType, name, users,
  });
  dispatch(actions.channels.add(res.data));
});

export const find = createMethod('channels/find', async (id: string, {actions, client, dispatch}) => {
    const res = await client.req({ type: 'channel:get', id });
    dispatch(actions.channels.add(res.data));
    return res.data;
});

