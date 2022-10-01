import { h } from 'preact';
import { useDispatch} from 'react-redux';
import { addReaction } from '../../services/messages';

export const Reaction = ({messageId, children}) => {
  const dispatch = useDispatch();

  return (
    <i onclick={() => dispatch(addReaction(messageId, children))}>
      {children}
    </i>
  );
};
