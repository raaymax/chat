import { useContext } from 'react';
import { methods } from '../storeExt';
import {ExtensionsContext} from '../components/extensions';

export const useMethods = (): typeof methods => {
  return useContext(ExtensionsContext).methods;
};
