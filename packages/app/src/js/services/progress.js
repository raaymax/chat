import { client } from '../core';
import { actions, selectors } from '../state';

export const loadBadges = () => async(dispatch) => {
  const {data} = await client.req2({
    type: 'loadBadges',
  })
  data.forEach((p) => dispatch(actions.addProgress(p)));
}

export const loadProgress = () => async(dispatch, getState) => {
  const channelId = selectors.getChannelId(getState());
  if (!channelId) return;
  const {data} = await client.req2({
    type: 'loadProgress',
    channelId,
  })
  data.forEach((p) => dispatch(actions.addProgress(p)));
}

export const updateProgress = (messageId) => async(dispatch) => {
  const {data} = await client.req2({
    type: 'updateProgress',
    messageId,
  })
  data.forEach((p) => dispatch(actions.addProgress(p)));
}
