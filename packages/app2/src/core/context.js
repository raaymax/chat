import {h} from 'preact';
import {useEffect, useCallback} from 'preact/hooks';
import { useSelector, useDispatch } from 'react-redux'
import {connect} from './client';
import { createNotifier } from '../js/utils';

const [notify, watch] = createNotifier();

export const createClientContext = () => {
  const isAlive = useSelector((state) => state.connection.isAlive);
  const dispatch = useDispatch();
  const client = useEffect(() => {
    console.log('connection', `${isAlive}`);
    if (isAlive === false) return;
    console.log('connection');
    return connect(dispatch, watch)
  }, [isAlive]);

  return createContext(notify);
}
