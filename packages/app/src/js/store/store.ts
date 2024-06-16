import { AsyncThunk, configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import { client, Client } from '../core';
import * as slices from './slices';

export const { actions } = slices;

export const store = configureStore({
  reducer: slices.reducers,
});

export type StateType = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;
export type StoreType = typeof store & { dispatch: DispatchType };
export type ActionsType = typeof actions;

export const data = { methods: {} };

export type Api<M = any> = {
  dispatch: DispatchType,
  getState: () => StateType
  actions: typeof actions,
  methods: M,
  client: Client
};
export type AsyncMutation<T, R, M> = (arg: T, api: Api<M>) => Promise<R>;
export type MutationMethod<R, M> = (api: Api<M>) => Promise<R>;

// eslint-disable-next-line @typescript-eslint/ban-types
export const createMethod = <T, R>(name: string, handler: AsyncMutation<T, R, any>): AsyncThunk<R, T, {}> => createAsyncThunk(`method/${name}`, (a: T) => handler(a, {
  dispatch: Object.assign(store.dispatch, { actions, methods: data.methods }),
  getState: store.getState,
  actions,
  methods: data.methods,
  client,
}));
