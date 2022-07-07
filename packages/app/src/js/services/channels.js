import {createAsyncThunk} from '@reduxjs/toolkit';
import { client } from '../core';

window.addEventListener('hashchange', async () => {
  const cid = window.location.hash.slice(1);
  client.emit('channel:changed', {channel: cid});
}, false);

export const openChannel = createAsyncThunk('channels/open', async (q, {getState}) => {
  const channel = getState().channels.list.find((c) => c.cid === q.cid || c.name === q.name);
  window.location.hash = channel.cid;
});

export const loadChannels = () => async () => client.req({ type: 'channels' });
