import { createAsyncThunk } from '@reduxjs/toolkit';

type MethodsDef<S, D, API, R> = {
  module_name: string;
  methods: {
    [key: string]: (args: any, { dispatch, getState }: { dispatch: D, getState: () => S }, api: API) => Promise<R>;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createMethods = <T extends MethodsDef<any, any, any, any>>(def: T) => {
  return Object.fromEntries(Object.entries(def.methods).map(([key, val]) => {
    return [key, createAsyncThunk(`${def.module_name}/${key}`, (arg: any, thunkApi: any) => val(arg, thunkApi, {}))];
  }));
}
