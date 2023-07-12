import {createModule} from '../tools';

export default createModule({
  name: 'me',
  initialState: null,
  reducers: {
    set: (state, action) => action.payload,
  },
});
