import { selectors } from '../state';
import { setStream } from './stream';

export const gotoDirectChannel = (userId, x = false) => async (dispatch, getState) => {
  const direct = selectors.getDirectChannel(userId)(getState());
  if (!x && !direct) {
    dispatch.methods.channels.create({channelType: 'DIRECT', name: 'Direct', users: [userId]});
    setTimeout(() => {
      dispatch(gotoDirectChannel(userId, x = !x));
    }, 1000);
    return;
  }
  if (!direct) return;
  dispatch(setStream('main', { type: 'live', channelId: direct.id }));
  dispatch.actions.view.set(null);
}
