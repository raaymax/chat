import { h } from 'preact';
import styled from 'styled-components';
import { Header } from './header';
import { Conversation } from '../../components/Conversation/conversation';

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--primary_border_color);
`;
export const SideConversation = ({className}) => (
  <Container className={className}>
    <Header />
    <Conversation />
  </Container>
)
