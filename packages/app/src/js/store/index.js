import {
  createStore, applyMiddleware, compose,
} from 'redux';
import { client } from '../core';
import * as modules from './modules';

export * as selectors from './selectors';

const middleware = ({ dispatch, getState }) => (next) => async (action) => {
  if (typeof action === 'function') {
    dispatch.actions = actions;
    dispatch.methods = methods;
    try {
      return await action(dispatch, getState, {client});
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
  return next(action);
}

export const store = createStore(
  modules.reducer,
  compose(applyMiddleware(middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()),
);

export const actions = Object.keys(modules.actions).reduce((acc, module) => {
  acc[module] = Object.keys(modules.actions[module]).reduce((acc2, action) => {
    acc2[action] = (data) => store.dispatch(modules.actions[module][action](data));
    return acc2;
  }, {});
  return acc;
}, {});

export const methods = Object.keys(modules.methods).reduce((acc, module) => {
  acc[module] = Object.keys(modules.methods[module]).reduce((acc2, action) => {
    acc2[action] = (...props) => store.dispatch(modules.methods[module][action](...props));
    return acc2;
  }, {});
  return acc;
}, {});

store.dispatch.actions = actions;
store.dispatch.methods = methods;
