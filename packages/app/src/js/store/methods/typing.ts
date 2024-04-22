import {createMethod} from '../store';

export const ack = createMethod('typing/ack', async (msg: {userId: string, channelId: string}, {actions, getState, dispatch}) => {
  const meId = getState().me;
  if (msg.userId === meId) return;
  dispatch(actions.typing.add(msg));
  setTimeout(() => dispatch(actions.typing.clear()), 1100);
});

type Notify = {
  channelId: string;
  parentId?: string;
};

export const notify = createMethod('typing/notify', async ({channelId, parentId}: Notify, { actions, methods, getState, client, dispatch}) => {
  const {cooldown} = getState().typing;
  if (cooldown) {
    dispatch(actions.typing.set({ queue: true }));
    return;
  }
  dispatch(actions.typing.set({ cooldown: true, queue: false }));
  client.send({ type: 'user:typing', channelId, parentId });
  setTimeout(() => {
    dispatch(actions.typing.set({ cooldown: false }));
    if (getState().typing.queue) {
      dispatch(methods.typing.notify({channelId, parentId}));
    }
  }, 1000);
});
