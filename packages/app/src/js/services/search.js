import { client } from '../core';
import { selectors } from '../state';

export const search = (text) => async (dispatch, getState) => {
  const channelId = selectors.getChannelId(getState());
  const data = await client.req({ type: 'messages:search', channelId, text });
  dispatch.actions.search.push({ text, data: data.data, searchedAt: new Date().toISOString() });
};
