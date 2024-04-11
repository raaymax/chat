import {
  Middleware, Dispatch, Action,
} from 'redux';
import { configureStore } from '@reduxjs/toolkit'
import { client } from '../core';
import * as slices from './slices';
import { ActionCreator, AsyncAction, AsyncHandler, PayloadAction, Reducer } from './types';
console.log(slices);


const isAsyncAction = (action: unknown): action is AsyncAction => (action as Action)?.type === 'async';

const middleware: Middleware = ({ dispatch, getState }) => (next) => async (action) => {
  // FIXME: remove this after migrating
  if (typeof action == 'function') {
    (dispatch as any).actions = actions;
    (dispatch as any).methods = methods;
    try {
      return await action(dispatch, getState, {client});
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return;
    }
  }
  if (isAsyncAction(action)) {
    const { handler } = action;
    (dispatch as any).actions = actions;
    (dispatch as any).methods = methods;
    try {
      return await handler(dispatch, getState, {client});
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return;
    }
  }

  return next(action);
};

export const store = configureStore({
  reducer: slices.reducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
});

function remap<T extends {[module: string]: {[key: string]: ActionCreator}}>(input: T): {[module: string]: {[key: string]: (data: unknown) => void}} {
  return Object.keys(input)
    .reduce<Partial<{[module: string]: {[key: string]: (data: unknown) => void}}>>((acc, module: string) => {
      const mod = input[module];
      acc[module] = Object.keys(mod)
        .reduce<{[key: string]: (data: unknown) => void}>((acc2, action: string) => {
          acc2[action] = async (data) => await store.dispatch(mod[action](data)).unwrap();
          return acc2;
        }, {});
      return acc;
    }, {}) as {[module: string]: {[key: string]: (data: unknown) => void}};
}

export const actions = remap(slices.actions);
export const methods = remap(slices.methods);
console.log(actions, methods);

export type StateType = typeof slices.reducer extends Reducer<infer S> ? S : never;
export type DispatchType = Dispatch<PayloadAction | AsyncAction>
  & { methods: typeof methods, actions: typeof actions };
export type StoreType = typeof store & { dispatch: DispatchType };


export const createAsyncAction = (handler: AsyncHandler<StateType, DispatchType, unknown>) => ({ type: 'async', handler });
