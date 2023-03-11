import { client } from '../core';
import { actions } from '../state';

export const loadPinnedMessages = (channelId) => async (dispatch) => {
  try {
    dispatch(actions.clearPinMessages(channelId));
    const req = await client.req({
      type: 'pins',
      channelId,
      limit: 50,
    })
    dispatch(actions.addPinMessages(req.data));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

export const pinMessage = (id, channelId) => async (dispatch) => {
  dispatch(actions.selectMessage(null));
  const req = await client.req({
    type: 'pin',
    channelId,
    id,
    pinned: true,
  });
  dispatch(actions.addMessages(req.data));
  dispatch(loadPinnedMessages(channelId));
}

export const unpinMessage = (id, channelId) => async (dispatch) => {
  dispatch(actions.selectMessage(null));
  const req = await client.req({
    type: 'pin',
    channelId,
    id,
    pinned: false,
  });
  dispatch(actions.addMessages(req.data));
  dispatch(loadPinnedMessages(channelId));
}
