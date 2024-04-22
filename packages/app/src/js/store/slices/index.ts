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

const modules = {
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
type Modules = typeof modules;
type Reducers<T extends {[key: string]: {reducer: unknown}}> = { [K in keyof T]: T[K]['reducer'] };
type Actions<T extends {[key: string]: {actions: unknown}}> = { [K in keyof T]: T[K]['actions'] };

export const reducers = Object.fromEntries(Object.entries(modules).map(([name, { reducer }]) => [name, reducer])) as Reducers<Modules>;
export const actions = Object.fromEntries(Object.entries(modules).map(([name, { actions }]) => [name, actions])) as Actions<Modules>;
