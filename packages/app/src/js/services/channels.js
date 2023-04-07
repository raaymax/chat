import { createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../core';
import { selectors, actions } from '../state';
import { logErrors } from './logger';

window.addEventListener('hashchange', async () => {
  const id = window.location.hash.slice(1);
  client.emit('channel:changed', {channelId: id});
}, false);

export const openChannel = createAsyncThunk('channels/open', async (q, {dispatch, getState}) => {
  dispatch(actions.setView(null));
  const channel = selectors.getChannel(q)(getState());
  window.location.hash = channel.id;
});

export const loadChannels = () => logErrors(async (dispatch) => {
  const res = await client.req({type: 'channels:load'});
  res.data.forEach((chan) => {
    dispatch(actions.addChannel(chan))
  })
})

export const createChannel = (name, priv = false) => logErrors(async (dispatch) => {
  const res = await client.req({type: 'channel:create', name, private: priv});
  res.data.forEach((chan) => {
    dispatch(actions.addChannel(chan))
  })
})
export const findChannel = (id) => logErrors(async (dispatch) => {
  const res = await client.req({ type: 'channel:find', id });
  res.data.forEach((chan) => {
    dispatch(actions.addChannel(chan))
  })
})
