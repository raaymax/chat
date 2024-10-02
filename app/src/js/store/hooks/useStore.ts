import * as reactRedux from 'react-redux';
import { StoreType } from '../store';

export const useStore = () => reactRedux.useStore<StoreType>();
