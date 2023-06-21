import {createModule} from '../tools';

export default createModule({
  name: 'system',
  initialState: { initFailed: false },
  reducers: {
    initFailed: (state, action) => ({ ...state, initFailed: action.payload }),
  },
});
