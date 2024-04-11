import * as reactRedux from 'react-redux';
import {DispatchType} from '../store'; 

export const useDispatch = reactRedux.useDispatch.withTypes<DispatchType>();
