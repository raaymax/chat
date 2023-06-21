import {createModule} from '../tools';

export default createModule({
  name: 'typing',
  initialState: { },
  reducers: {
    add: (state, action) => {
      const newState = {...state};
      [action.payload].flat().forEach(({userId, channelId}) => {
        newState[channelId] = newState[channelId] || {};
        newState[channelId][userId] = new Date().toISOString();
      });
      return newState;
    },
    clear: (state) => Object.fromEntries(
      Object.entries(state)
        .map(([channelId, users]) => [
          channelId,
          Object.fromEntries(
            Object.entries(users)
              .filter(([, date]) => new Date(date) > new Date(Date.now() - 1000)),
          ),
        ]),
    ),
  },
});
