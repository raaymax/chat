import { client } from '../core';
import { actions, selectors } from '../state';

export const search = (text) => async (dispatch, getState) => {
  const cid = selectors.getCid(getState());
  const data = await client.req2({ type: 'search', channel: cid, text });
  dispatch(actions.addSearchResult({text, data: data.data, searchedAt: new Date().toISOString()}));
}
