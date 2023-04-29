/* eslint-disable no-undef */
import { Capacitor } from '@capacitor/core';
import { client } from '../core';
import { actions } from '../state';
import { initNotifications } from './notifications';
import { loadEmojis } from './emoji';
import { loadProgress, loadBadges } from './progress';
import { reloadStream, loadFromUrl } from './stream';

const initApp = (withStream = false) => async (dispatch) => {
  if (navigator.userAgentData.mobile) {
    document.body.setAttribute('class', 'mobile');
  }
  await dispatch(actions.connected());
  await dispatch(actions.clearInfo());
  await dispatch(actions.initFailed(false));
  const { data: [config] } = await client.req({type: 'config:get'});
  await dispatch(actions.setAppVersion(config.appVersion));
  await db.global.put({key: 'appVersion', value: config.appVersion});
  await db.global.put({key: 'channelId', value: config.mainChannelId});
  await dispatch(actions.setMainChannel(config.mainChannelId));
  await initNotifications(config);
  const { data: users } = await client.req({type: 'users:load'});
  await db.users.bulkPut(users);

  await dispatch(actions.addUser(users));
  const { data: channels } = await client.req({type: 'channels:load'});
  await db.channels.bulkPut(channels);
  await dispatch(actions.addChannel(channels));
  // FIXME: load messages from current channel or none
  // dispatch(loadMessages({channelId: config.mainChannelId}));
  await dispatch(loadEmojis());
  await dispatch(loadProgress({channelId: config.mainChannelId}));
  await dispatch(loadBadges());
  // eslint-disable-next-line no-console
  console.log('version check: ', APP_VERSION, config.appVersion);
  if (config.appVersion !== APP_VERSION) {
    await dispatch(showUpdateMessage());
  }

  await dispatch(loadFromUrl());
};

let tryCount = 1
export const init = (withStream) => async (dispatch) => {
  try {
    await dispatch(initApp(withStream))
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
  await dispatch(actions.initFailed(false));
  await dispatch(init());
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
