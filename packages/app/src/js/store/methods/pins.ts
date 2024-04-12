import {createMethod} from '../store';

export const load = createMethod('pins/load', async (channelId, {actions, client}) => {
  actions.pins.clear(channelId);
  const req = await client.req({
    type: 'message:pins',
    channelId,
    limit: 50,
  });
  actions.pins.add(req.data);
});

type Pin = {
  id: string;
  channelId: string;
};

export const pin = createMethod('pins/pin', async ({id, channelId}: Pin, {actions, methods, client}) => {
  const req = await client.req({
    type: 'message:pin',
    channelId,
    id,
    pinned: true,
  });
  actions.messages.add(req.data);
  await methods.pins.load(channelId);
})

export const unpin = createMethod('pins/unpin', async ({id, channelId}: Pin, {actions, methods, client}) => {
  const req = await client.req({
    type: 'message:pin',
    channelId,
    id,
    pinned: false,
  });
  actions.messages.add(req.data);
  await methods.pins.load(channelId);
});
