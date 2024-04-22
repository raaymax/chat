import {createMethod} from '../store';

export const loadBadges = createMethod('progress/loadBadges', async (_arg, {actions, client, dispatch}) => {
  const { data } = await client.req({
    type: 'readReceipt:getOwn',
  });
  dispatch(actions.progress.add(data));
});

type Stream = {
  channelId: string;
  parentId: string;
};

export const loadProgress = createMethod('progress/loadProgress', async (stream: Stream, {actions, client, dispatch}) => {
  try{
    if (!stream.channelId) return;
    const { data } = await client.req({
      type: 'readReceipt:getChannel',
      channelId: stream.channelId,
      parentId: stream.parentId,
    });
    dispatch(actions.progress.add(data));
  }catch(err){
    // eslint-disable-next-line no-console
    console.error(err)
  }
});

export const update = createMethod('progress/update', async (messageId: string, {actions, client, dispatch}) => {
  const { data } = await client.req({
    type: 'readReceipt:update',
    messageId,
  });
  dispatch(actions.progress.add(data));
});
