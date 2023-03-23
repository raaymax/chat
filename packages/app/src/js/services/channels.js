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

export const loadChannels = () => async (dispatch) => {
  try {
    const res = await client.req({type: 'loadChannels'});
    res.data.forEach((chan) => {
      dispatch(actions.addChannel(chan))
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}

export const createChannel = (name, priv = false) => async (dispatch) => {
  try {
    const res = await client.req({type: 'createChannel', name, private: priv});
    res.data.forEach((chan) => {
      dispatch(actions.addChannel(chan))
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
export const findChannel = (id) => async (dispatch) => {
  try {
    const res = await client.req({ type: 'findChannel', id });
    res.data.forEach((chan) => {
      dispatch(actions.addChannel(chan))
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
}
