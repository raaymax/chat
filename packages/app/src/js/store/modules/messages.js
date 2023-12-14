import {createModule} from '../tools';

export default createModule({
  name: 'messages',
  initialState: {
    data: [],
    loading: false,
    status: 'live',
    hovered: null,
  },
  reducers: {
    hover: (state, action) => ({...state, hovered: action.payload}),
    setStatus: (state, action) => ({...state, status: action.payload}),
    loadingFailed: (state, action) => ({...state, loadingFailed: action.payload}),
    loading: (state) => ({...state, loading: true}),
    loadingDone: (state) => ({...state, loading: false}),
    clear: (state, action) => {
      const { data } = state;
      const { stream: { parentId, channelId } } = action.payload;
      const ids = data
        .filter(((m) => m.channelId === channelId && (!parentId || m.parentId === parentId)))
        .map((m) => m.id);

      return {...state, data: data.filter((m) => !ids.includes(m.id))};
    },

    add: (state, action) => {
      action.payload.info = action.payload.info || null;
      const newState = {...state, data: [...state.data] };
      [action.payload].flat().forEach((msg) => {
        if (msg.createdAt) {
          msg.createdAt = (new Date(msg.createdAt)).toISOString();
        }
        const idx = newState.data.findIndex((m) => (m.id && m.id === msg.id)
          || (m.clientId && m.clientId === msg.clientId));

        if (idx !== -1) {
          newState.data[idx] = { ...newState.data[idx], ...msg};
          return;
        }
        let pos = newState.data.findIndex((m) => m.createdAt < msg.createdAt);
        if (pos === -1 && newState.data.some((m) => m.createdAt > msg.createdAt)) pos = newState.data.length;
        newState.data.splice(pos, 0, msg);
      });
      return newState;
    },

    takeOldest: (state, action) => {
      const newState = {...state, data: [...state.data] };
      const { stream: { channelId, parentId }, count } = action.payload;

      const channel = newState.data
        .filter((m) => m.channelId === channelId && m.parentId === parentId && m.id !== parentId);
      const toRemove = new Set(channel
        .slice(0, Math.max(channel.length - count, 0))
        .map((m) => m.id))
      newState.data = newState.data.filter((m) => !toRemove.has(m.id));
      return newState;
    },

    takeYoungest: (state, action) => {
      const newState = {...state, data: [...state.data] };
      const { stream: { channelId, parentId }, count } = action.payload;

      const channel = newState.data
        .filter((m) => m.channelId === channelId && m.parentId === parentId && m.id !== parentId);

      const toRemove = new Set(channel.map((m) => m.id));
      channel
        .slice(0, Math.min(count, channel.length))
        .forEach((m) => toRemove.delete(m.id));

      newState.data = newState.data.filter((m) => !toRemove.has(m.id));
      return newState;
    },
  },

  methods: {
    load: (query) => async ({actions}, getState, { client }) => {
      const req = await client.req({
        limit: 50,
        ...query,
        type: 'message:getAll',
      });
      actions.messages.add(req.data);
      return req.data;
    },
    addReaction: (id, text) => async ({actions}, getState, { client }) => {
      const req = await client.req({
        type: 'reaction:send',
        id,
        reaction: text.trim(),
      });
      actions.messages.add(req.data);
    },
  },
});
