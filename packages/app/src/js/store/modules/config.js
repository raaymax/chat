import {createModule} from '../tools';

export default createModule({
  name: 'config',
  initialState: {},
  reducers: {
    setAppVersion: (state, action) => ({...state, appVersion: action.payload }),
  },
  methods: {
    load: () => async ({ actions }, getState, { client }) => {
      const { data: [config] } = await client.req({ type: 'config:get' });
      actions.config.setAppVersion(config.appVersion);
      return config;
    },
  },
});
