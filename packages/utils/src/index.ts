import { TypeAtPath, TypeAtStrPath } from './types';

// eslint-disable-next-line no-return-assign
const pGet = (obj, path: string[]) => path.reduce((o, p) => o && (o[p] = o[p] || {}), obj);
const baseGet = <T, P extends string[]>(obj: T, path: P): TypeAtPath<T, P> => path.reduce((o, p) => o && o[p], obj);

export const get = <T, P extends string>(obj: T, path: P): TypeAtStrPath<T, P> => baseGet(obj, path.split('.')) as TypeAtStrPath<T, P>;

export const set = (obj, path, value) => {
  const all = path.split('.');
  const leaf1 = baseGet(obj, all.slice(0, -1));
  if (!leaf1 && typeof value === 'undefined') return obj;
  const leaf = pGet(obj, all.slice(0, -1));
  leaf[all[all.length - 1]] = value;
  return obj;
};
export const rm = <T>(obj: T, from: string): T => {
  const all = from.split('.');
  const leaf = baseGet(obj, all.slice(0, -1));
  leaf[all[all.length - 1]] = undefined;
  return obj;
};
export const pop = (obj, from) => {
  const all = from.split('.');
  const leaf = baseGet(obj, all.slice(0, -1));
  const value = leaf[all[all.length - 1]];
  leaf[all[all.length - 1]] = undefined;
  return value;
};
export const remap = (obj, path, fn) => set(obj, path, fn(get(obj, path)));
export const remapAll = (obj, path, fn) => path.reduce((acc, p) => set(acc, p, fn(get(obj, p))), obj);

export const move = (obj, from, to) => set(obj, to, pop(obj, from));
