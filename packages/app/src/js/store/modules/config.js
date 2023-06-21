import {createModule} from '../tools';

export default createModule({
  name: 'config',
  initialState: {},
  reducers: {
    setAppVersion: (state, action) => ({...state, appVersion: action.payload }),
  },
});
