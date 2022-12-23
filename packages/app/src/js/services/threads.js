import { actions } from '../state';

export const openThread = (stream) => async (dispatch) => {
  dispatch(actions.setThread(stream));
  dispatch(actions.setView('thread'));
}
