import {createMethod} from '../store';

export const loadBadges = createMethod('progress/loadBadges', async (_arg, {actions, client}) => {
  const { data } = await client.req({
    type: 'readReceipt:getOwn',
  });
  actions.progress.add(data);
});

type Stream = {
  channelId: string;
  parentId: string;
};

export const loadProgress = createMethod('progress/loadProgress', async (stream: Stream, {actions, client}) => {
  try{
    if (!stream.channelId) return;
    const { data } = await client.req({
      type: 'readReceipt:getChannel',
      channelId: stream.channelId,
      parentId: stream.parentId,
    });
    actions.progress.add(data);
  }catch(err){
    // eslint-disable-next-line no-console
    console.error(err)
  }
});

export const update = createMethod('progress/update', async (messageId, {actions, client}) => {
  const { data } = await client.req({
    type: 'readReceipt:update',
    messageId,
  });
  actions.progress.add(data);
});
