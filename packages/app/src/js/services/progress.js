import { client } from '../core';
import { actions } from '../state';

export const loadBadges = () => async(dispatch) => {
  const {data} = await client.req2({
    type: 'loadBadges',
  })
  data.forEach((p) => dispatch(actions.addProgress(p)));
}

export const loadProgress = (stream) => async(dispatch) => {
  if (!stream.channelId) return;
  const {data} = await client.req2({
    type: 'loadProgress',
    channelId: stream.channelId,
    parentId: stream.parentId,
  })
  data.forEach((p) => dispatch(actions.addProgress(p)));
}

export const updateProgress = (messageId) => async(dispatch) => {
  try {
    const {data} = await client.req2({
      type: 'updateProgress',
      messageId,
    })
    await Promise.all(data.map((p) => dispatch(actions.addProgress(p))));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}
