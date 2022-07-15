import { h } from 'preact';
import { useState } from 'preact/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { addReaction } from '../services/messages';

export const Reaction = ({messageId, children}) => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  return (
    <i onclick={() => dispatch(addReaction(messageId, children))}>
      {children}
    </i>
  );
};
