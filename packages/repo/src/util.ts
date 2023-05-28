/* eslint-disable no-nested-ternary */
import { ObjectId } from 'mongodb';
import {
  WithoutUndefined, Id,
} from './types';

export const removeUndefined = <T extends Record<string, unknown>>(arg: T): WithoutUndefined<T> => (
  Object.fromEntries(Object.entries(arg).filter(([, v]) => v !== undefined)) as WithoutUndefined<T>
);
export const makeObjectId = (id: Id | undefined | null): ObjectId | undefined | null => (
  id ? new ObjectId(id) : (typeof id === 'undefined' ? undefined : null)
);
export const makeId = (id: ObjectId | undefined): Id | undefined => (
  id ? id.toHexString() as Id : undefined
);
export const makeDate = (date: Date | undefined): Date | undefined => (
  date ? (date instanceof Date ? date : new Date(date)) : undefined
);
