import {createMethod} from '../store';

export const load = createMethod('channels/load', async (_arg, {client, actions}): Promise<void> => {
  const res = await client.req({ type: 'channel:getAll' });
  actions.channels.add(res.data);
});

export const create = createMethod('channels/create', async ({channelType, name, users}: {channelType: string, name: string, users: string[]}, {client, actions}) => {
  const res = await client.req({
    type: 'channel:create', channelType, name, users,
  });
  actions.channels.add(res.data);
});

export const find = createMethod('channels/find', async (id, {actions, client}) => {
    const res = await client.req({ type: 'channel:get', id });
    actions.channels.add(res.data);
    return res.data;
});

