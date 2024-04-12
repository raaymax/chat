import {createMethod} from '../store';

type Query = {};

export const load = createMethod('messages/load', async (query: Query, {actions, client }) => {
  const req = await client.req({
    limit: 50,
    ...query,
    type: 'message:getAll',
  });
  actions.messages.add(req.data);
  return req.data;
});

type Reaction = {
  id: string;
  text: string;
}
export const addReaction = createMethod('messages/addReaction', async (args: Reaction, {actions, client }) => {
  const req = await client.req({
    type: 'message:react',
    id: args.id,
    reaction: args.text.trim(),
  });
  actions.messages.add(req.data);
});
