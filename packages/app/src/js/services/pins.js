import { client } from '../core';
import { actions, selectors } from '../state';

export const loadPinnedMessages = (channel) => async (dispatch, getState) => {
  try {
    dispatch(actions.clearPinMessages(channel));
    const req = await client.req2({
      type: 'pins',
      channel,
      limit: 50,
    })
    console.log(req);
    dispatch(actions.addPinMessages(req.data));
  } catch (err) {
    console.log(err);
  }
}

export const pinMessage = (id, channel) => async (dispatch, getState) => {
  const req = await client.req2({
    type: 'pin',
    channel,
    id,
    pinned: true,
  });
  dispatch(actions.addMessages(req.data));
  dispatch(loadPinnedMessages(channel));
}

export const unpinMessage = (id, channel) => async (dispatch, getState) => {
  const req = await client.req2({
    type: 'pin',
    channel,
    id,
    pinned: false,
  });
  dispatch(actions.addMessages(req.data));
  dispatch(loadPinnedMessages(channel));
}
