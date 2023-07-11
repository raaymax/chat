import {createModule} from '../tools';

export default createModule({
  name: 'users',
  initialState: {},
  reducers: {
    add: (state, action) => {
      const newState = {...state};
      [action.payload].flat().forEach((user) => {
        newState[user.id] = Object.assign(newState[user.id] || {}, user);
      });
      return newState;
    },
  },
  methods: {
    load: () => async ({actions}, getState, {client}) => {
      const res = await client.req({ type: 'users:load' });
      actions.users.add(res.data);
    },
  },
});
