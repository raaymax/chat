import { Action, configureStore, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../core';
import * as slices from './slices';

export const store = configureStore({
  reducer: slices.reducers,
});

export type StateType = ReturnType<typeof store.getState>;
export type DispatchType = typeof store.dispatch;
export type StoreType = typeof store & { dispatch: DispatchType };

const createAction = <T extends (a: unknown) => Action>(_name: string, fn: T): ((arg: Parameters<T>[0]) => void) => {
  return ((arg) => store.dispatch(fn(arg))) as ((arg: Parameters<T>[0]) => void);
}


type InputActions= {
  [module: string]: {
    [key: string]: (a: any) => Action
  }
}

type RemapActions<T> = T extends (a: any) => Action
  ? ((arg: unknown) => void)
  : never

type RemapActionsObject<T> = {
  [K in keyof T]: {
    [K2 in keyof T[K]]: RemapActions<T[K][K2]>
  }
}

const remapActions = <
  F extends InputActions,
>(input: F): RemapActionsObject<F> => {
  return Object.entries(input)
    .reduce<Record<string, Record<string, any>>>((acc, [module, mod]) => {
      acc[module] = Object.entries(mod)
        .reduce((acc2: any, [action, fn]) => {
          acc2[action] = createAction(`${mod}/${action}`, fn)
          return acc2;
        }, {});
      return acc;
    }, {}) as RemapActionsObject<F>;
}

export const actions = remapActions(slices.actions);
export const data = { methods: {}, run: async () => {}}; 

export type Api<M = any> = {
  run: <R>(handler: MutationMethod<R, M>) => Promise<R>,
  dispatch: DispatchType,
  getState: () => StateType
  actions: typeof actions,
  methods: M,
  client: typeof client,
};
export type AsyncMutation<T, R, M> = (arg: T, api: Api<M>) => Promise<R>;
export type MutationMethod<R, M> = (api: Api<M>) => Promise<R>;

export const createMethod = <T, R>(name: string, handler: AsyncMutation<T, R, any>): ((a: T) => Promise<R>) => {
  return async (arg) => store.dispatch(createAsyncThunk(`mutation/${name}`, (a: T) => handler(a, {
    run: data.run as any,
    dispatch: Object.assign(store.dispatch, {actions, methods: data.methods}), 
    getState: store.getState,
    actions,
    methods: data.methods,
    client,
  }))(arg)).unwrap() as R;
}

export const run = async <R>(handler: MutationMethod<R, any>): Promise<R> => {
  return store.dispatch(createAsyncThunk(`mutation/${handler.name}`, () => handler({
    run,
    dispatch: Object.assign(store.dispatch, {actions, methods: data.methods}), 
    getState: store.getState,
    actions,
    methods: data.methods,
    client,
  }))()).unwrap() as R;
}
