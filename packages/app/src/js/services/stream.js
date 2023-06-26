import { loadMessages } from './messages';
import * as url from './url';

export const setStream = (id, stream) => async (dispatch) => {
  if (id === 'main') url.saveStream(stream);
  dispatch.actions.stream.set({ id, value: stream });
};

export const reloadStream = (id) => async (dispatch, getState) => {
  const value = getState().stream[id];
  if (value) {
    dispatch(loadMessages(value));
    dispatch.methods.progress.loadProgress(value);
  }
};

export const loadFromUrl = () => async (dispatch) => {
  const stream = url.loadStream();
  dispatch.actions.stream.set({ id: 'main', value: stream });
};
