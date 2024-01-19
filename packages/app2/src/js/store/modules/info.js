import {createModule} from '../tools';

export default createModule({
  name: 'info',
  initialState: { type: null, message: '' },
  reducers: {
    show: (state, action) => action.payload,
  },
});
