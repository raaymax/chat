import { actions, selectors } from '../state';
import {loadMessages} from './messages';
import {loadProgress } from './progress';
import { omitUndefined } from '../utils';

export const setStream = (id, value) => async (dispatch, getState) => {
  if (selectors.getStream(id)(getState()) === value) return;
  const mainChannelId = selectors.getMainChannelId(getState());
  const stream = {channelId: mainChannelId, ...value};
  if (id === 'main') saveInUrl(stream);
  dispatch(actions.setStream({id, value: stream}));
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

export const loadFromUrl = () => async (dispatch) => {
  const { hash } = document.location;
  const matcher = /(?<channelId>[0-9a-f]{24})(\/(?<parentId>[0-9a-f]{24}))?(\?(?<query>.*))?/
  const m = hash.match(matcher);
  if (!m) return dispatch(setStream('main', {type: 'live'}));
  const {channelId, parentId, query} = m.groups;
  const params = new URLSearchParams(query);
  const date = params.get('date');
  const selected = params.get('selected');

  dispatch(setStream('main', {
    type: 'archive',
    channelId,
    ...(selected ? {selected} : {}),
    ...(parentId ? {parentId} : {}),
    ...(date ? {date} : {}),
  }));
}

const saveInUrl = (stream) => {
  const query = new URLSearchParams(omitUndefined({
    date: stream.date,
    selected: stream.selected,
  }));
  const querystring = query.toString();
  // eslint-disable-next-line prefer-template
  window.location.hash = `/${stream.channelId}`
    + (stream.parentId ? `/${stream.parentId}` : '')
    + (querystring ? `?${querystring}` : '');
};
