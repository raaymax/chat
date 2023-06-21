import {combineReducers} from 'redux';
import channels from './channels';
import me from './me';
import users from './users';
import stream from './stream';
import messages from './messages';
import emojis from './emojis';
import config from './config';
import connection from './connection';
import system from './system';
import info from './info';
import progress from './progress';
import view from './view';
import files from './files';
import typing from './typing';
import pins from './pins';
import search from './search';

const MODULES = {
  channels,
  me,
  users,
  stream,
  messages,
  emojis,
  config,
  connection,
  system,
  info,
  progress,
  view,
  files,
  typing,
  pins,
  search,
};

export const reducer = combineReducers(Object.entries(MODULES).reduce((acc, [name, value]) => ({
  ...acc,
  [name]: value.reducer,
}), {}));

export const actions = Object.entries(MODULES).reduce((acc, [name, value]) => ({
  ...acc,
  [name]: value.actions,
}), {});

export const methods = Object.entries(MODULES).reduce((acc, [name, value]) => ({
  ...acc,
  [name]: value.methods,
}), {});
