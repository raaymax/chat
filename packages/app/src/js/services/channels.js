import { client } from '../core';
import { actions, selectors } from '../state';
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

export const createChannel = ({channelType, name, users}) => async (dispatch ) => {
  try {
    const res = await client.req({
      type: 'channel:create', channelType, name, users,
    });
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

export const gotoDirectChannel = (userId, x = false) => async (dispatch, getState) => {
  const meId = selectors.getMeId(getState());
  const direct = getState().channels.list.find((c) => (
    c.direct === true
    && c.users.includes(userId)
    && (userId === meId
      ? (c.users.length === 2 && c.users.every(u => u === meId))
      : true )));
  if (!x && !direct) {
    dispatch(createChannel({channelType: 'DIRECT', name: 'Direct', users: [userId]}));
    setTimeout(() => {
      dispatch(gotoDirectChannel(userId, x = !x));
    }, 1000);
    return;
  }
  if(!direct) return;
  dispatch(setStream('main', { type: 'live', channelId: direct.id }));
  dispatch(actions.setView(null));
}
