import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { gotoDirectChannel } from '../../services/channels';

const StyledLink = styled.a`
  span {
    padding-left: 1px;
    color: ${(props) => props.theme.mentionsColor};
  }
`;

type UserMentionProps = {
  userId: string;
};

export const UserMention = ({ userId: id }: UserMentionProps) => {
  //FIXME: dispatch and state type
  const dispatch: any = useDispatch();
  const user = useSelector((state: any) => state.users[id]);

  return (
    <StyledLink className='channel' onClick={() => dispatch(gotoDirectChannel(id))} data-id={id} href={`#`} >
      <span className='name'>@{user?.name || id}</span>
    </StyledLink>
  );
};
