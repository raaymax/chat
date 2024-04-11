import * as reactRedux from 'react-redux';
import {StateType} from '../store'; 

export const useSelector = reactRedux.useSelector.withTypes<StateType>();
