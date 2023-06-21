import { selectors } from '../state';
import { loadMessages } from './messages';
import { loadProgress } from './progress';
import * as url from './url';

export const setStream = (id, value) => async (dispatch, getState) => {
  if (selectors.getStream(id)(getState()) === value) return;
  const mainChannelId = selectors.getMainChannelId(getState());
  const stream = value ? { channelId: mainChannelId, ...value } : value;
  if (id === 'main') url.saveStream(stream);
  dispatch.actions.stream.set({ id, value: stream });
};

export const reloadStream = (id) => async (dispatch, getState) => {
  const value = selectors.getStream(id)(getState());
  if (value) {
    dispatch(loadMessages(value));
    dispatch(loadProgress(value));
  }
};

export const loadFromUrl = () => async (dispatch) => {
  const stream = url.loadStream();
  dispatch(setStream('main', stream));
};
