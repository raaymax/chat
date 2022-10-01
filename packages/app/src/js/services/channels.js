import { createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../core';
import { selectors, actions } from '../state';

window.addEventListener('hashchange', async () => {
  const cid = window.location.hash.slice(1);
  client.emit('channel:changed', {channel: cid});
}, false);

export const openChannel = createAsyncThunk('channels/open', async (q, {dispatch, getState}) => {
  dispatch(actions.setView(null));
  const channel = selectors.getChannel(q)(getState());
  window.location.hash = channel.cid;
});

export const loadChannels = () => async () => client.req({ type: 'channels' });
