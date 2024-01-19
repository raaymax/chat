import {createModule} from '../tools';

export default createModule({
  name: 'channels',
  initialState: {},
  reducers: {
    add: (state, action) => {
      const newState = {...state};
      [action.payload].flat().forEach((channel) => {
        newState[channel.id] = Object.assign(newState[channel.id] || {}, channel);
      });
      return newState;
    },
    remove: (state, action) => {
      const id = action.payload;
      const newState = {...state};
      delete newState[id];
      return newState;
    },
  },
  methods: {
    load: () => async ({actions}, getState, {client}) => {
      const res = await client.req({ type: 'channel:getAll' });
      actions.channels.add(res.data);
    },
    create: ({channelType, name, users}) => async ({actions}, getState, {client}) => {
      const res = await client.req({
        type: 'channel:create', channelType, name, users,
      });
      actions.channels.add(res.data);
    },
    find: (id) => async ({actions}, getState, {client}) => {
      const res = await client.req({ type: 'channel:get', id });
      actions.channels.add(res.data);
    },
  },
});
