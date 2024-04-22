import { data, store, actions, AsyncMutation } from './store';
import * as methods from './methods';
import { client } from '../core';
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';

export * as methods from './methods';
export * from './store';

data.methods = methods;

export type MethodsType = typeof methods;

// eslint-disable-next-line @typescript-eslint/ban-types
export const createMethod = <T, R>(name: string, handler: AsyncMutation<T, R, typeof methods>): AsyncThunk<R, T, {}> => {
  return createAsyncThunk(`method/${name}`, (a: T) => handler(a, {
    dispatch: Object.assign(store.dispatch, {actions, methods: data.methods}), 
    getState: store.getState,
    actions,
    methods,
    client,
  }));
}

