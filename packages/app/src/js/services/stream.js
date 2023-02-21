import { actions, selectors } from '../state';
import {loadMessages} from './messages';
import {loadProgress } from './progress';

export const setStream = (id, value) => async (dispatch, getState) => {
  if (selectors.getStream(id)(getState()) === value) return;
  dispatch(actions.setStream({id, value}));
  if (value ) {
    dispatch(loadMessages(value));
    dispatch(loadProgress(value));
  }
}

export const reloadStream = (id) => async (dispatch, getState) => {
  const value = selectors.getStream(id)(getState());
  if (value ) {
    dispatch(loadMessages(value));
    dispatch(loadProgress(value));
  }
}
