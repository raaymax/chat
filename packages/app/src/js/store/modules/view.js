import {createModule} from '../tools';

export default createModule({
  name: 'view',
  initialState: {current: null},
  reducers: {
    set: (state, action) => {
      const view = action.payload;
      if (state.current === view) {
        return {current: null};
      }
      return {current: view};
    },
  },
});
