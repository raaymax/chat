import { client } from '../core';
import { createCounter } from '../utils';
import { actions, selectors } from '../state';

export const loadBadges = () => async(dispatch, getState) => {
  const {data} = await client.req2({
    type: 'loadBadges',
  })
  data.forEach((p) => dispatch(actions.addProgress(p)));
}

export const loadProgress = (channelId) => async(dispatch, getState) => {
  const {data} = await client.req2({
    type: 'loadProgress',
    channelId,
  })
  data.forEach((p) => dispatch(actions.addProgress(p)));
}

export const updateProgress = (messageId) => async(dispatch, getState) => {
  const {data} = await client.req2({
    type: 'updateProgress',
    messageId,
  })
  data.forEach((p) => dispatch(actions.addProgress(p)));
}
