import { createMethod } from '../store';

type Query = {
  channelId: string;
  parentId?: string,
  pinned?: string,
  before?: string,
  after?: string,
  limit?: number,
}

export const load = createMethod('messages/load', async (query: Query, { actions, client, dispatch }) => {
  const req = await client.req({
    limit: 50,
    ...query,
    type: 'message:getAll',
  });
  console.log('load', req.data);
  dispatch(actions.messages.add(req.data));
  return req.data;
});

type Reaction = {
  id: string;
  text: string;
}
export const addReaction = createMethod('messages/addReaction', async (args: Reaction, { actions, client, dispatch }) => {
  const req = await client.req({
    type: 'message:react',
    id: args.id,
    reaction: args.text.trim(),
  });
  dispatch(actions.messages.add(req.data));
});
