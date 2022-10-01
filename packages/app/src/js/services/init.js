/* eslint-disable no-undef */
import { Capacitor } from '@capacitor/core';
import { client } from '../core';
import { actions } from '../state';
import {initNotifications} from './notifications';
import {loadMessages} from './messages';

export const init = () => async (dispatch) => {
  try {
    dispatch(actions.messagesLoading());
    dispatch(actions.connected());
    dispatch(actions.clearInfo());
    dispatch(actions.initFailed(false));
    const {data: [config]} = await client.req2({type: 'config'});
    dispatch(actions.setAppVersion(config.appVersion));
    // eslint-disable-next-line no-console
    console.log('version check: ', APP_VERSION, config.appVersion);
    if (config.appVersion !== APP_VERSION) {
      dispatch(showUpdateMessage());
      return;
    }
    await initNotifications(config);
    const { data: users } = await client.req2({type: 'users'});
    dispatch(actions.addUser(users));
    const { data: channels } = await client.req2({type: 'channels'});
    dispatch(actions.addChannel(channels));
    dispatch(loadMessages());
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    dispatch(actions.initFailed(true));
  }
}

const showUpdateMessage = () => {
  dispatch(actions.messagesClear());
  if (Capacitor.isNativePlatform()) {
    dispatch(actions.addMessage({
      id: 'update-version',
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
      id: 'update-version',
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
