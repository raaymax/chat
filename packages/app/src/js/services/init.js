/* eslint-disable no-undef */
import { client } from '../core';
import { actions } from '../state';
import { initNotifications } from './notifications';
import { loadEmojis } from './emoji';
import { loadProgress, loadBadges } from './progress';
import { reloadStream, loadFromUrl } from './stream';

const initApp = (withStream = false) => async (dispatch) => {
  const {actions, methods} = dispatch;
  if (navigator.userAgentData.mobile) {
    document.body.setAttribute('class', 'mobile');
  }
  actions.connection.connected();
  actions.info.reset();
  actions.system.initFailed(false);
  const { data: [config] } = await client.req({ type: 'config:get' });
  actions.config.setAppVersion(config.appVersion);
  actions.stream.setMain(config.mainChannelId);
  await initNotifications(config);
  methods.users.load();
  methods.channels.load();
  // FIXME: load messages from current channel or none
  // dispatch(loadMessages({channelId: config.mainChannelId}));
  await dispatch(loadEmojis());
  await dispatch(loadProgress({ channelId: config.mainChannelId }));
  await dispatch(loadBadges());
  // eslint-disable-next-line no-console
  console.log('version check: ', APP_VERSION, config.appVersion);
  if (config.appVersion !== APP_VERSION) {
    await dispatch(showUpdateMessage());
  }

  await dispatch(loadFromUrl());

  if (withStream) {
    await dispatch(reloadStream('main'));
  }
};

let tryCount = 1;
export const init = (withStream) => async (dispatch) => {
  try {
    await dispatch(initApp(withStream));
    tryCount = 1;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    if (tryCount < 4) {
      setTimeout(() => dispatch(init()), 1000 * tryCount ** 2);
      tryCount += 1;
      return;
    }
    actions.system.initFailed(true);
  }
};

export const reinit = () => async (dispatch) => {
  tryCount = 1;
  await dispatch(actions.initFailed(false));
  await dispatch(init());
};

// FIXME: messages have no channel and are not showing
const showUpdateMessage = () => (dispatch) => {
  dispatch.actions.messages.add({
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
  });
};
