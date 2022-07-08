import { configureStore, createSelector, createAction } from '@reduxjs/toolkit'
import messages, { actions as messageActions } from './messages';
import connected, { actions as connectionActions } from './connection';
import config, { actions as configActions } from './config';
import channels, { actions as channelActions } from './channels';
import users, { actions as userActions } from './users';
import info, { actions as infoActions } from './info';
import files, { actions as fileActions, filesAreReady } from './files';
import typing, { actions as typingActions } from './typing';

const logout = createAction('logout');

export const actions = {
  logout,
  ...messageActions,
  ...connectionActions,
  ...configActions,
  ...channelActions,
  ...userActions,
  ...infoActions,
  ...fileActions,
  ...typingActions,
}

export const selectors = {
  getChannel: (q) => (state) => state.channels.list
    .find((c) => c.cid === q.cid || c.name === q.name),
  getChannels: (state) => state.channels.list,
  getConfig: (state) => state.config,
  getCid: (state) => state.channels.current,
  getMeId: (state) => state.users.meId,
  getFiles: (state) => state.files.list,
  getMessages: createSelector(
    (state) => state.channels.current,
    (state) => state.messages.list,
    (channel, messages) => messages
      .filter((msg) => msg.channel === channel),
  ),
  getEarliestDate: () => createSelector(
    (state) => state.messages.list,
    (messages) => (messages[0] ? messages[0].createdAt : new Date().toISOString()),
  ),
  getMessage: (id) => createSelector(
    (state) => state.messages.list,
    (messages) => messages
      .find((m) => (m.id && m.id === id)
        || (m.clientId && m.clientId === id)),
  ),
  getCurrentChannel: createSelector(
    (state) => state.channels.list,
    (state) => state.channels.current,
    (list, cid) => list.find((c) => c.cid === cid) || {cid},
  ),
  getInfo: (state) => state.info,
  getUser: (userId) => createSelector(
    (state) => state.users.list.find((user) => user.id === userId),
    (state) => state.users.list.find((user) => user.id === 'system'),
    (user, system) => user || system,
  ),
  filesAreReady: createSelector(
    (state) => state.files,
    filesAreReady,
  ),

  getTyping: () => createSelector(
    (state) => state.channels.current,
    (state) => state.typing,
    (state) => state.users.list,
    (cid, typing, users) => Object.keys(typing[cid] || {})
      .map((id) => users.find((u) => u.id === id)),
  ),
}

export default configureStore({
  devTools: true,
  reducer: {
    config,
    connected,
    messages,
    users,
    channels,
    info,
    files,
    typing,
  },
})
