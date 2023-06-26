import {createModule} from '../tools';

export default createModule({
  name: 'stream',
  initialState: { main: {}, side: null, mainChannelId: null },
  reducers: {
    set: (state, action) => {
      const { id, value } = action.payload;
      if (value) {
        return {...state, [id]: { id, channelId: state.mainChannelId, ...value }};
      }
      return {...state, [id]: value };
    },
    patch: (state, action) => {
      const { id, patch = {} } = action.payload;
      return {...state, [id]: { ...state[id], ...patch }};
    },
    setMain: (state, action) => {
      const id = action.payload;
      return {...state, mainChannelId: id };
    },
  },
});
