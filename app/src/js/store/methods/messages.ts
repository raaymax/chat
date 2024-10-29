import { createMethod } from '../store';

type Query = {
  channelId: string;
  parentId?: string,
  before?: string,
  after?: string,
  limit?: number,
}

export const load = createMethod('messages/load', async (query: Query, { actions, client, dispatch }) => {
  try{ 
    const data = await client.messages.fetch({
      limit: 50,
      ...query,
    });
    dispatch(actions.messages.add(data));
    return data;
  }catch(e){
    console.error(e);
  }
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
