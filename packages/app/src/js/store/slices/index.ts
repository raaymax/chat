import * as channels from './channels';
import * as me from './me';
import * as users from './users';
import * as stream from './stream';
import * as messages from './messages';
import * as emojis from './emojis';
import * as config from './config';
import * as connection from './connection';
import * as system from './system';
import * as info from './info';
import * as progress from './progress';
import * as view from './view';
import * as files from './files';
import * as typing from './typing';
import * as pins from './pins';
import * as search from './search';

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
type Methods<T extends {[key: string]: {methods: unknown}}> = { [K in keyof T]: T[K]['methods'] };
type Actions<T extends {[key: string]: {actions: unknown}}> = { [K in keyof T]: T[K]['actions'] };

export const reducers = Object.fromEntries(Object.entries(modules).map(([name, {reducer}]) => [name, reducer])) as Reducers<Modules>;
export const methods = Object.fromEntries(Object.entries(modules).map(([name, {methods}]) => [name, methods])) as Methods<Modules>;
export const actions = Object.fromEntries(Object.entries(modules).map(([name, {actions}]) => [name, actions])) as Actions<Modules>;
