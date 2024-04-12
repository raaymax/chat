import {createMethod} from '../store';

export const ack = createMethod('typing/ack', async (msg: {userId: string, channelId: string}, {actions, getState}) => {
  const meId = getState().me;
  if (msg.userId === meId) return;
  actions.typing.add(msg);
  setTimeout(() => actions.typing.clear({}), 1100);
});

type Notify = {
  channelId: string;
  parentId: string;
};

export const notify = createMethod('typing/notify', async ({channelId, parentId}: Notify, { actions, methods, getState, client}) => {
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
});
