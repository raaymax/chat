import { client } from '../core';
import { actions } from '../state';

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
