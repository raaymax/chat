import {createModule} from '../tools';

export default createModule({
  name: 'progress',
  initialState: [],
  reducers: {
    add: (state, action) => {
      const newState = [...state];
      [action.payload].flat().forEach((progress) => {
        const idx = newState.findIndex((item) => item.channelId === progress.channelId
          && item.userId === progress.userId && item.parentId === progress.parentId);
        if (idx !== -1) {
          newState[idx] = { ...newState[idx], ...progress };
          return newState;
        }
        newState.push(progress);
      });
      return newState;
    },
  },
});
