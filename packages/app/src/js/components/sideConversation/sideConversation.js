
import { h } from 'preact';
import styled from 'styled-components';
import { Header } from './header';
import { Conversation } from '../messages/conversation';

const Container = styled.div`
  flex: 1;
  width: 50vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--primary_border_color);
`;
export const SideConversation = ({stream, className}) => (
  <Container className={className}>
    <Header channelId={stream.channelId} /> {/* FIXME: use stream */}
    <Conversation stream={stream} />
  </Container>
)
