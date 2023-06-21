import {createModule} from '../tools';

const INIT = null;
export default createModule({
  name: 'me',
  initialState: INIT,
  reducers: {
    set: (state, action) => {
      return action.payload;
    },
    reset: () => INTI,
  },
});
