import { createSlice } from '@reduxjs/toolkit';
import { createMethods } from '../tools';

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

const slice = createSlice({
  name: 'users',
  initialState: {} as Record<string, User>,
  reducers: {
    add: (state, action) => {
      const newState = {...state};
      ([action.payload] as User[]).flat().forEach((user) => {
        newState[user.id] = Object.assign(newState[user.id] || {}, user);
      });
      return newState;
    },
  },
});

export const methods = createMethods({
  module_name: 'users',
  methods: {
    load: async (_arg, {dispatch: {actions}}, {client}) => {
      const res = await client.req({ type: 'user:getAll' });
      actions.users.add(res.data);
    },
  },
});

export const { reducer, actions } = slice;
