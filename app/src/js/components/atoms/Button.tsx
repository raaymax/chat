import styled from 'styled-components';
import { AppTheme } from '../../types';
import { useSize } from '../contexts/useSize';
import { cn, ClassNames } from '../../utils';

interface IconButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  size?: number;
  children?: React.ReactNode;
  className?: ClassNames;
}

const StyledButton = styled.button<{ $size: number}>`
  min-width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  font-style: normal;
  cursor: pointer;
  border-radius: 4px;
  display: inline-block;
  background-color: transparent;
  border: none;
  box-sizing: border-box;

  &:active {
    background-color: ${({ theme }) => (theme as AppTheme).buttonActiveBackground};
  }

  color: inherit;
`;

export const Button = ({
  onClick, size, children, className,
}: IconButtonProps) => {
  const $size = useSize(size);
  return (
    <StyledButton onClick={onClick} $size={$size ?? 40} className={cn(className)}>
      {children}
    </StyledButton>
  );
};
