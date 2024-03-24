import styled from 'styled-components';

interface IconProps {
  icon: string;
  size: number;
}


const StyledIcon = styled.i<{ $size: number}>`
  margin: auto;
  padding: 0;
  vertical-align: middle;
  text-align: center;
  display: inline;
  line-height: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  line-height: ${(props) => props.$size}px;
  font-size: ${(props) => props.$size}px;
`;


export const Icon = ({ size, icon }: IconProps) => (
  <StyledIcon className={'icon ' + icon} $size={size} />
);
