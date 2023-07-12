import {createModule} from '../tools';

export default createModule({
  name: 'connection',
  initialState: false,
  reducers: {
    connected: () => true,
    disconnected: () => false,
  },
});
