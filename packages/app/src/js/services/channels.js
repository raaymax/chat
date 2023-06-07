import { client } from '../core';
import { actions } from '../state';
import { setStream } from './stream';

export const loadChannels = () => async (dispatch) => {
  try {
    const res = await client.req({ type: 'channels:load' });
    res.data.forEach((chan) => {
      dispatch(actions.addChannel(chan));
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

export const createChannel = (name, priv = false) => async (dispatch) => {
  try {
    const res = await client.req({ type: 'channel:create', name, private: priv });
    res.data.forEach((chan) => {
      dispatch(actions.addChannel(chan));
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};
export const findChannel = (id) => async (dispatch) => {
  try {
    const res = await client.req({ type: 'channel:find', id });
    res.data.forEach((chan) => {
      dispatch(actions.addChannel(chan));
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
  }
};

export const gotoDirectChannel = (userId) => async (dispatch, getState) => {
  const direct = getState().channels.list.find((c) => c.direct === true && c.users.includes(userId));
  if (!direct) {
    return;
  }
  dispatch(setStream('main', { type: 'live', channelId: direct.id }));
  dispatch(actions.setView(null));
}
