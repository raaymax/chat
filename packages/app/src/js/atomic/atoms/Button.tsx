import styled from 'styled-components';
import {AppTheme} from '../../types';
import { useSize } from '../../contexts/size';

interface IconButtonProps {
  onClick: () => void;
  size: number;
  children: React.ReactNode;
}


const StyledButton = styled.button<{ $size: number}>`
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  font-style: normal;
  cursor: pointer;
  border-radius: 4px;
  display: inline-block;
  background-color: transparent;
  border: none;
  box-sizing: border-box;

  &:hover {
    background-color: ${({theme}): string => (theme as AppTheme).buttonHoverBackground};
  }

  &:active {
    background-color: ${({theme})=> (theme as AppTheme).buttonActiveBackground};
  }
`;


export const Button = ({ onClick, size, children}: IconButtonProps) => {
  const $size = useSize(size);
  return (
    <StyledButton onClick={onClick} $size={$size ?? 40}>
      {children}
    </StyledButton>
  );
}
