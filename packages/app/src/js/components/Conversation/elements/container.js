import {h} from 'preact';
import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  width: 100%;
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--primary_border_color);
`;
