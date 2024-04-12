import { useContext } from 'react';
import { run } from '../storeExt';
import {ExtensionsContext} from '../components/extensions';

export const useRun = (): typeof run => {
  return useContext(ExtensionsContext).run;
};
