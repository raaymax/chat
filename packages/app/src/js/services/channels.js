import { createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../core';
import { selectors, actions } from '../state';

window.addEventListener('hashchange', async () => {
  const id = window.location.hash.slice(1);
  client.emit('channel:changed', {channelId: id});
}, false);

export const openChannel = createAsyncThunk('channels/open', async (q, {dispatch, getState}) => {
  dispatch(actions.setView(null));
  const channel = selectors.getChannel(q)(getState());
  window.location.hash = channel.id;
});

export const loadChannels = () => async () => {
  try {
    const res = await client.req2({type: 'channels'});
    res.data.forEach((usr) => {
      dispatch(actions.addChannel(usr))
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
