import { h } from 'preact';
import styled from 'styled-components';
import { Header } from './header';
import { Conversation } from '../../Conversation/conversation';

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--primary_border_color);
`;
export const MainConversation = ({className, onclick}) => (
  <Container className={className}>
    <Header onclick={onclick} />
    <Conversation />
  </Container>
)
