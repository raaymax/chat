import { Action, ActionCreator as ActionCreatorPrev, Reducer } from 'redux';

export type { Action, Reducer };

export type AsyncHandler< S = unknown, D = unknown, API = unknown, R = unknown> = (dispatch: D, getState: () => S, api: API) => Promise<R>;
export type AsyncAction = {type: 'async', handler: AsyncHandler};
export type PayloadAction<T = unknown> = { type: string, payload?: T };

export type ActionCreator<T = unknown, P = unknown> = (args?: P) => PayloadAction<T>;

export type Method< S = unknown, D = unknown, API = unknown> = (...args: any) => (dispatch: D, getState: () => S, api: API) => Promise<void>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type Module<S = any, R = object, M extends { [key: string]: Method<S>; } = {}> = {
  reducer: Reducer<S>;
  actions: Actions<R>,
  methods: M;
};

export type Reducers<T> = { 
  [key: string]: <X extends any>(state: T, action: PayloadAction<X>) => T
};
export type Methods = { [key: string]: (...args: any) => (dispatch: any, getState: () => any, api: any) => Promise<void> };


export type Actions<T> = { [K in keyof T]: ActionCreator<PayloadAction> };

export type StateFromReducer<T extends Reducer> = T extends Reducer<infer S> ? S : never;

export type CombinedState<T extends Record<string, Module>> = { [K in keyof T]: (T[K]['reducer'] extends Reducer<infer S, PayloadAction> ? S : never)};

export type CombinedModule<T extends Record<string, Module>> = {
  actions: { [K in keyof T]: T[K]['actions'] };
  methods: { [K in keyof T]: T[K]['methods'] };
  reducer: Reducer<CombinedState<T>, PayloadAction>;
};


