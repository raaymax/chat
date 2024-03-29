/* eslint-disable no-undef */
import { initNotifications } from './notifications';

const initApp = () => async (dispatch, getState) => {
  const {actions, methods} = dispatch;
  if (navigator?.userAgentData?.mobile) {
    document.body.setAttribute('class', 'mobile');
  }
  actions.connection.connected();
  actions.info.reset();
  const config = await methods.config.load();
  actions.stream.setMain(config.mainChannelId);
  await initNotifications(config);
  await methods.users.load();
  await methods.channels.load();
  await methods.emojis.load();
  await methods.progress.loadBadges();
  const channelId = getState().stream.main.channelId;
  if (!channelId) {
    actions.stream.open({id: 'main', value: {type: 'live'}});
  }else if( !getState().channels[channelId] ){
    const c = await methods.channels.find(channelId);
    if(!c || c.length === 0) {
      actions.stream.open({id: 'main', value: {type: 'live'}});
    }
  }
};

let tryCount = 1;
export const init = () => async (dispatch) => {
  try {
    await dispatch(initApp());
    tryCount = 1;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    if (tryCount < 4) {
      setTimeout(() => {
        actions.system.initFailed(false);
        dispatch(init())
      }, 1000 * tryCount ** 2);
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
