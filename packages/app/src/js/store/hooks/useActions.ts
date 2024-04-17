import { useContext } from 'react';
import { actions } from '../storeExt';
import {ExtensionsContext} from '../components/extensions';

export const useActions = (): typeof actions => {
  return useContext(ExtensionsContext).actions;
};
