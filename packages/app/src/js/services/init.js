/* eslint-disable no-undef */
import { Capacitor } from '@capacitor/core';
import { client } from '../core';
import { actions } from '../state';
import { initNotifications } from './notifications';
import { loadEmojis } from './emoji';
import { loadProgress, loadBadges } from './progress';

const initApp = async (dispatch) => {
  if (Capacitor.isNativePlatform()) {
    document.body.setAttribute('class', 'mobile');
  }
  dispatch(actions.connected());
  dispatch(actions.clearInfo());
  dispatch(actions.initFailed(false));
  const {data: [config]} = await client.req2({type: 'config'});
  dispatch(actions.setAppVersion(config.appVersion));
  dispatch(actions.setMainChannel(config.mainChannelId));
  await initNotifications(config);
  const { data: users } = await client.req2({type: 'users'});
  dispatch(actions.addUser(users));
  const { data: channels } = await client.req2({type: 'channels'});
  dispatch(actions.addChannel(channels));
  // FIXME: load messages from current channel or none
  // dispatch(loadMessages({channelId: config.mainChannelId}));
  dispatch(loadEmojis());
  dispatch(loadProgress({channelId: config.mainChannelId}));
  dispatch(loadBadges());
  // eslint-disable-next-line no-console
  console.log('version check: ', APP_VERSION, config.appVersion);
  if (config.appVersion !== APP_VERSION) {
    dispatch(showUpdateMessage());
  }
};

let tryCount = 1
export const init = () => async (dispatch) => {
  try {
    dispatch(initApp)
    tryCount = 1;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    if (tryCount < 4) {
      setTimeout(() => dispatch(init()), 1000 * tryCount ** 2);
      tryCount += 1;
      return;
    }
    dispatch(actions.initFailed(true));
  }
}

export const reinit = () => async (dispatch) => {
  tryCount = 1;
  dispatch(actions.initFailed(false));
  dispatch(init());
}

// FIXME: messages have no channel and are not showing
const showUpdateMessage = () => (dispatch) => {
  if (Capacitor.isNativePlatform()) {
    dispatch(actions.addMessage({
      clientId: 'update-version',
      priv: true,
      createdAt: new Date(),
      user: {
        name: 'System',
      },
      message: [
        { line: { bold: { text: 'Your Quack app version is outdated!!' } } },
        { line: { text: `Your app version: ${APP_VERSION}` } },
        { line: { text: `Required version ${msg.config.appVersion}` } },
        { line: { text: 'Please update' } },
      ],
    }));
  } else {
    // setTimeout(() => window.location.reload(true), 5000);
    dispatch(actions.addMessage({
      clientId: 'update-version',
      priv: true,
      createdAt: new Date(),
      user: {
        name: 'System',
      },
      message: [
        { line: { bold: { text: 'Your Quack version is outdated!!' } } },
        { line: { text: 'Please reload the page to update' } },
      ],
    }));
  }
}
