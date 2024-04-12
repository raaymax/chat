import { useContext } from 'react';
import { actions } from '../storeExt';
import {ExtensionsContext} from '../components/extensions';

export const useAction = (): typeof actions => {
  return useContext(ExtensionsContext).actions;
};
