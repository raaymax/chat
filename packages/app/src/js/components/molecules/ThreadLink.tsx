import styled from 'styled-components';
import { useDispatch } from 'react-redux';

const Link = styled.span`
  color: ${(props) => props.theme.linkColor};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

type ThreadLinkProps = {
  channelId: string;
  parentId: string;
  text: string;
};

export const ThreadLink = ({ channelId, parentId, text }: ThreadLinkProps) => {
  //FIXME: dispatch as any
  const dispatch: any = useDispatch();
  return (
    <Link onClick={() => dispatch.actions.stream.open({id: 'side', value: { type: 'live', channelId, parentId }})}>
      {text || 'Thread'}
    </Link>
  );
};
