import {h} from 'preact';
import styled from 'styled-components';

const ReInit = styled.div`
  cursor: pointer;
  border: 0;
  text-align: center;
  color: var(--color_danger);
  vertical-align: middle;
  height: 50px;
  line-height: 25px;
  border-top: 1px solid var(--border_color);
  &:hover {
    background-color: var(--secondary_background);
  }
`;


export const InitFailedButton = ({onClick}) => (
  <ReInit onClick={onClick}>
    Failed to initialize<br />
    Click to retry...
  </ReInit>
);
