import { client } from '../core';
import { actions, selectors } from '../state';

export const search = (text) => async (dispatch, getState) => {
  const cid = selectors.getCid(getState());
  dispatch(actions.clearSearchResults());
  dispatch(actions.setSearchInput(text));
  await client.send({ type: 'search', channel: cid, text });
}
