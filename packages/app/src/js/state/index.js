/* eslint-disable no-restricted-syntax */
import { configureStore, createSelector, createAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import messages, { actions as messageActions } from './messages';
import connected, { actions as connectionActions } from './connection';
import config, { actions as configActions } from './config';
import channels, { actions as channelActions } from './channels';
import users, { actions as userActions } from './users';
import info, { actions as infoActions } from './info';
import files, { actions as fileActions, filesAreReady } from './files';
import typing, { actions as typingActions } from './typing';
import view, { actions as viewActions } from './view';
import search, { actions as searchActions } from './search';
import pins, { actions as pinActions } from './pins';
import system, { actions as systemActions } from './system';
import customEmojis, { actions as cusotmEmojisActions } from './customEmojis';
import progress, { actions as progressActions } from './progress';
import stream, { actions as streamActions } from './stream';

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
  ...viewActions,
  ...searchActions,
  ...pinActions,
  ...systemActions,
  ...cusotmEmojisActions,
  ...progressActions,
  ...streamActions,
};

const getStreamMessages = (stream, messages) => messages
  .filter((m) => m.channelId === stream.channelId
    && (
      ((!stream.parentId && !m.parentId) || m.parentId === stream.parentId)
    || (!stream.parentId && m.parentId === m.id)));

export const selectors = {
  getProgress: ({ channelId, parentId }) => createSelector(
    (state) => state.channels.list.find((c) => c.id === channelId),
    (state) => state.progress,
    (state) => state.users.list,
    (channel, progress, users) => (channel ? progress
      .filter((p) => p.channelId === channel.id)
      .filter((p) => (!p.parentId && !parentId) || p.parentId === parentId)
      .map((p) => ({
        ...p,
        user: users.find((u) => u.id === p.userId),
      }))
      .reduce((acc, p) => ({
        ...acc,
        [p.lastMessageId]: [...(acc[p.lastMessageId] || []), p],
      }), {}) : {}),
  ),
  getMainChannelId: (state) => state.stream.mainChannelId,
  getBadges: (userId) => createSelector(
    (state) => state.progress,
    (progress) => progress
      .filter((p) => p.userId === userId)
      .filter((p) => !p.parentId)
      .reduce((acc, p) => ({
        ...acc,
        [p.channelId]: p.count,
      }), {}),
  ),
  getEmoji: (shortname) => (state) => state.customEmojis
    .find((emoji) => emoji.shortname === shortname),
  getCategorizedEmojis: (state) => state.customEmojis
    .reduce((acc, emoji) => {
      acc[emoji.category] = acc[emoji.category] || [];
      acc[emoji.category].push(emoji);
      return acc;
    }, {}),
  getEmojis: (state) => state.customEmojis,
  getAllEmojis: () => (state) => state.customEmojis,
  getChannel: (q) => (state) => state.channels.list
    .find((c) => (q.id && c.id === q.id)
      || (q.name && c.name === q.name)
      || (q.cid && c.cid && c.cid === q.cid)),
  getChannels: createSelector(
    (state) => state.users.meId,
    (state) => state.channels.list,
    (meId, channels) => channels
      .filter((c) => c.users?.includes(meId)),
  ),
  getConfig: (state) => state.config,
  getChannelId: (state) => state.stream.main.channelId,
  getMeId: (state) => state.users.meId,
  getMyId: (state) => state.users.meId,
  getFiles: (state) => state.files.list,
  getView: (state) => state.view.current,
  getSearchResults: (state) => state.search.results,
  getPinnedMessages: (channel) => (state) => state.pins.data[channel] || [],
  getMessagesStatus: (state) => state.messages.status,
  getHoveredMessage: (state) => state.messages.hovered,
  getInitFailed: (state) => state.system.initFailed,
  getMessagesLoadingFailed: (state) => state.messages.loadingFailed,
  getMessagesLoading: (state) => state.messages.loading,
  getMessagesPrevLoading: (state) => state.messages.loading || state.messages.loadingPrevious,
  getMessagesNextLoading: (state) => state.messages.loading || state.messages.loadingNext,
  // getSelectedMessage: (state) => state.messages.selected,
  // countMessagesInChannel: (channel, state) => state.messages.data[channel]?.length || 0,
  countMessagesInStream: (stream) => (state) => getStreamMessages(stream, state.messages.data)
    .length,
  getStreamMessages: (stream) => (state) => getStreamMessages(stream, state.messages.data),
  getLatestDate: (stream) => (state) => {
    const data = getStreamMessages(stream, state.messages.data)
      .filter((m) => m.id !== stream.parentId);
    return data.length ? data[0].createdAt : new Date().toISOString();
  },
  getEarliestDate: (stream) => (state) => {
    const data = getStreamMessages(stream, state.messages.data)
      .filter((m) => m.id !== stream.parentId);
    return data.length ? data[data.length - 1].createdAt : new Date().toISOString();
  },
  getMessage: (id) => (state) => state.messages.data
    .find((m) => m.id === id || m.clientId === id) || null,
  getCurrentChannel: createSelector(
    (state) => state.channels.list,
    (state) => state.stream.main.channelId,
    (list, channelId) => list.find((c) => c.id === channelId) || { id: channelId },
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
    (state) => state.stream.main.channelId,
    (state) => state.typing,
    (state) => state.users.list,
    (channelId, typing, users) => Object.keys(typing[channelId] || {})
      .map((id) => users.find((u) => u.id === id)),
  ),

  getStream: (id) => (state) => state.stream[id],
};

export const useUser = (userId) => useSelector(selectors.getUser(userId));
export const useStream = (id) => useSelector(selectors.getStream(id));

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
    view,
    search,
    pins,
    system,
    customEmojis,
    progress,
    stream,
  },
});
