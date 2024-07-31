import { createMethod } from '../store';

export const load = createMethod('pins/load', async (channelId: string, { actions, client, dispatch }) => {
  dispatch(actions.pins.clear(channelId));
  const req = await client.req({
    type: 'message:pins',
    channelId,
    limit: 50,
  });
  dispatch(actions.pins.add(req.data));
});

type Pin = {
  id: string;
  channelId: string;
};

export const pin = createMethod('pins/pin', async ({ id, channelId }: Pin, {
  actions, methods, client, dispatch,
}) => {
  const req = await client.req({
    type: 'message:pin',
    id,
    pinned: true,
  });
  dispatch(actions.messages.add(req.data));
  await dispatch(methods.pins.load(channelId));
});

export const unpin = createMethod('pins/unpin', async ({ id, channelId }: Pin, {
  actions, methods, client, dispatch,
}) => {
  const req = await client.req({
    type: 'message:pin',
    id,
    pinned: false,
  });
  dispatch(actions.messages.add(req.data));
  await dispatch(methods.pins.load(channelId));
});
