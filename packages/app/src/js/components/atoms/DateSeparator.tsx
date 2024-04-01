import styled from 'styled-components';
import { formatDateDetailed } from '../../utils';

const StyledDateSeparator = styled.div`
  text-align: center;
  line-height: 30px;
  height: 50px;
  display: block;
  flex: 0;
  position: relative;
  background-color: #38393b;
  margin-top: 10px;
  margin-bottom: 10px;
`;

type DateSeparatorProps = {
  date: string | undefined;
}

export const DateSeparator = ({ date }: DateSeparatorProps) => (
  <StyledDateSeparator>
    {formatDateDetailed(date)}
  </StyledDateSeparator>
);
