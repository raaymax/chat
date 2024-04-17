import { data, store, actions, AsyncMutation, MutationMethod } from './store';
import * as methods from './methods';
import { client } from '../core';
import { createAsyncThunk } from '@reduxjs/toolkit';

export * as methods from './methods';
export * from './store';

data.methods = methods;


export const createMethod = <T, R>(name: string, handler: AsyncMutation<T, R, typeof methods>): ((a: T) => Promise<R>) => {
  return async (arg) => store.dispatch(createAsyncThunk(`mutation/${name}`, (a: T) => handler(a, {
    run: data.run as any,
    dispatch: Object.assign(store.dispatch, {actions, methods: data.methods}), 
    getState: store.getState,
    actions,
    methods,
    client,
  }))(arg)).unwrap() as R;
}

export const run = async <R>(handler: MutationMethod<R, typeof methods>): Promise<R> => {
  return store.dispatch(createAsyncThunk(`mutation/${handler.name}`, () => handler({
    run,
    dispatch: Object.assign(store.dispatch, {actions, methods: data.methods}), 
    getState: store.getState,
    actions,
    methods,
    client,
  }))()).unwrap() as R;
}


