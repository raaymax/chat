import { createSlice } from '@reduxjs/toolkit';
import { omitUndefined } from '../../utils';
import { Stream } from '../../types';

type StreamState = {
  main: Stream,
  side: Stream | null,
  mainChannelId: string | null,
};

const loadStream = () => {
  const { hash } = document.location;
  const matcher = /(?<channelId>[0-9a-f]{24})(\/(?<parentId>[0-9a-f]{24}))?(\?(?<query>.*))?/;
  const m = hash.match(matcher);
  if (!m) return { type: 'live' };
  const { channelId, parentId, query } = m.groups ?? {};
  const params = new URLSearchParams(query);
  const date = params.get('date');
  const selected = params.get('selected');
  const type = params.get('type') || 'archive';

  return {
    id: 'main',
    type,
    channelId,
    ...(selected ? { selected } : {}),
    ...(parentId ? { parentId } : {}),
    ...(date ? { date } : {}),
  };
};

const saveStream = (stream: Stream) => {
  const query = new URLSearchParams(omitUndefined({
    type: stream.type,
    date: stream.date,
    selected: stream.selected,
  }) as Record<string, string>);
  const querystring = query.toString();

  window.location.hash = `/${stream.channelId}${
    stream.parentId ? `/${stream.parentId}` : ''
  }${querystring ? `?${querystring}` : ''}`;
};

export default createSlice({
  name: 'stream',
  initialState: { main: loadStream(), side: null, mainChannelId: null } as StreamState,
  reducers: {
    open: (state, action) => {
      const { id, value } = action.payload;
      if (id === 'main') saveStream({ channelId: state.mainChannelId, ...value });
      if (value) {
        return { ...state, [id]: { id, channelId: state.mainChannelId, ...value } };
      }
      return { ...state, [id]: {id, ...value} };
    },

    setMain: (state, action) => {
      const id = action.payload;
      return { ...state, mainChannelId: id };
    },
  },
});
