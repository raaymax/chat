import { client } from '../core';
import { actions } from '../state';

export const loadPinnedMessages = (channel) => async (dispatch) => {
  try {
    dispatch(actions.clearPinMessages(channel));
    const req = await client.req2({
      type: 'pins',
      channel,
      limit: 50,
    })
    dispatch(actions.addPinMessages(req.data));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

export const pinMessage = (id, channel) => async (dispatch) => {
  dispatch(actions.selectMessage(null));
  const req = await client.req2({
    type: 'pin',
    channel,
    id,
    pinned: true,
  });
  dispatch(actions.addMessages(req.data));
  dispatch(loadPinnedMessages(channel));
}

export const unpinMessage = (id, channel) => async (dispatch) => {
  dispatch(actions.selectMessage(null));
  const req = await client.req2({
    type: 'pin',
    channel,
    id,
    pinned: false,
  });
  dispatch(actions.addMessages(req.data));
  dispatch(loadPinnedMessages(channel));
}
