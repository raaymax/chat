import { client } from '../core';
import { actions } from '../state';
import { logErrors } from './logger';

export const loadBadges = () => async(dispatch) => {
  const {data} = await client.req({
    type: 'badges:load',
  })
  data.forEach((p) => dispatch(actions.addProgress(p)));
}

export const loadProgress = (stream) => async(dispatch) => {
  if (!stream.channelId) return;
  const {data} = await client.req({
    type: 'progress:load',
    channelId: stream.channelId,
    parentId: stream.parentId,
  })
  data.forEach((p) => dispatch(actions.addProgress(p)));
}

export const updateProgress = (messageId) => logErrors(async(dispatch) => {
  const {data} = await client.req({
    type: 'progress:update',
    messageId,
  })
  await Promise.all(data.map((p) => dispatch(actions.addProgress(p))));
})
