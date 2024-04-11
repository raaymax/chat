import { createSlice } from "@reduxjs/toolkit";
import { createMethods } from "../tools";

type TypingState = {
  [channelId: string]: {
    [userId: string]: string;
  };
} & {
  cooldown: boolean;
  queue: boolean;
};

const slice = createSlice({
  name: 'typing',
  initialState: { cooldown: false, queue: false } as TypingState,
  reducers: {
    add: (state, action) => {
      const newState = {...state};
      [action.payload].flat().forEach(({userId, channelId}) => {
        newState[channelId] = newState[channelId] || {};
        newState[channelId][userId] = new Date().toISOString();
      });
      return newState;
    },
    clear: (state, _action) => ({
      ...Object.fromEntries(
        Object.entries(state)
          .map(([channelId, users]) => [
            channelId,
            Object.fromEntries(
              Object.entries(users)
                .filter(([, date]) => new Date(date) > new Date(Date.now() - 1000)),
            ),
          ]),
      ),
      cooldown: false,
      queue: false,
    }),
    set: (state, action) => ({...state, ...action.payload}),
  },
});

export const methods = createMethods({
  module_name: 'typing',
  methods: {
    ack: async (msg, {dispatch, getState}) => {
      const meId = getState().me;
      if (msg.userId === meId) return;
      dispatch.actions.typing.add(msg);
      setTimeout(() => dispatch.actions.typing.clear(), 1100);
    },
    notify: () => ({channelId, parentId}, {dispatch: { actions, methods }, getState}, {client}) => {
      const {cooldown} = getState().typing;
      if (cooldown) {
        actions.typing.set({ queue: true });
        return;
      }
      actions.typing.set({ cooldown: true, queue: false });
      client.send({ type: 'user:typing', channelId, parentId });
      setTimeout(() => {
        actions.typing.set({ cooldown: false });
        if (getState().typing.queue) {
          methods.typing.notify({channelId, parentId});
        }
      }, 1000);
    },
  },
});

export const { reducer, actions } = slice;
