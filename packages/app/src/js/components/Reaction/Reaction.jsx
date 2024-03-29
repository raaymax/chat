import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { useMessageData } from '../../contexts/message';
import PropTypes from 'prop-types';

const StyledReactions = styled.div`
  i {
    background-color: var(--secondary_active_mask);
    border-radius: 10px;
    padding: 2px 5px;
    margin-right: 5px;
    border: 1px solid #565856;
    font-style: normal;
    cursor: pointer;
  }
`;

export const Reactions = () => {
  const { id, reactions = [] } = useMessageData();
  const dispatch = useDispatch();

  const reactionMap = reactions
    .reduce((acc, r) => ({ ...acc, [r.reaction]: (acc[r.reaction] || 0) + 1 }), {});
  return (
    <StyledReactions>
      {Object.entries(reactionMap).map(([key, count], idx) => (
        <i key={idx} onClick={() => dispatch.methods.messages.addReaction(id, key)}>{count > 1 ? `${count} ` : ''}{key}</i>
      ))}
    </StyledReactions>
  );
};

export const Reaction = ({ messageId, children }) => {
  const dispatch = useDispatch();

  return (
    <i onClick={() => dispatch.methods.messages.addReaction(messageId, children)}>
      {children}
    </i>
  );
};

Reaction.propTypes = {
  messageId: PropTypes.string,
  children: PropTypes.node,
};
