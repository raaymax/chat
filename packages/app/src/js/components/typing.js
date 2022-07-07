import {h} from 'preact';
import { useSelector } from 'react-redux';
import {selectors} from '../state';

export const Typing = () => {
  const typing = useSelector(selectors.getTyping());
  if (!typing.length) {
    return null;
  }

  const names = typing.map((u) => u.name).join(', ');
  return <div class='info'>{names} is typing!</div>;
}
