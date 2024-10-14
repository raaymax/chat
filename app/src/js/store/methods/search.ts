import { createMethod } from '../store';

type Query = {
  channelId: string;
  text: string;
};

export const find = createMethod('search/find', async ({ channelId, text }: Query, { actions, client, dispatch }) => {
  const data = await client.req({ type: 'message:search', channelId, text });
  dispatch(actions.search.push({ text, data: data.data, searchedAt: new Date().toISOString() }));
});
