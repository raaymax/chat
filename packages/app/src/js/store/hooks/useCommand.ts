import { useContext } from 'react';
import {CommandContext} from '../components/command';

export const useCommand = () => {
  return useContext(CommandContext);
};
