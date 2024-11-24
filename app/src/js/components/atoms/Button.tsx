import styled from 'styled-components';
import { useSize } from '../contexts/useSize';
import { cn, ClassNames } from '../../utils';
import { Tooltip } from './Tooltip';


const Container = styled.button`
  font-style: normal;
  cursor: pointer;
  border-radius: 8px;
  display: inline-block;
  background-color: transparent;
  box-sizing: border-box;
  border: none;

  &:hover {
    background-color: ${({ theme }) => theme.Labels};
  }

  &.primary {
    border: none;
    background-color: ${({ theme }) => theme.PrimaryButton.Background};
    color: inherit;

    &:active {
      background-color: ${({ theme }) => theme.buttonActiveBackground};
    }
  }

  &.secondary {
    border: none;
    color: ${({ theme }) => theme.Text};
    border: 1px solid ${({ theme }) => theme.SecondaryButton.Default};
    padding: 11px 16px;

    &:hover {
      border: 1px solid ${({ theme }) => theme.SecondaryButton.Hover};
      background-color: transparent;
    }

    &:active {
      background-color: ${({ theme }) => theme.SecondaryButton.Background};
      border: 1px solid ${({ theme }) => theme.SecondaryButton.Default};
    }
  }

  
`;
interface IconButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  size?: number;
  children?: React.ReactNode;
  className?: ClassNames;
  type?: 'primary' | 'secondary' | 'other';
  tooltip?: string | string[];
}

export const Button = ({
  onClick, size, children, className, type = 'other', tooltip,
}: IconButtonProps) => {
  const $size = useSize(size);
  if (tooltip) {
    return (
      <Tooltip text={tooltip}>
        <Container onClick={onClick} style={{
          minWidth: $size + 'px',
          height: $size + 'px',
        }} className={cn(className, type)}>
          {children}
        </Container>
      </Tooltip>
    );
  }
  return (
    <Container onClick={onClick} style={{
      minWidth: $size + 'px',
      height: $size + 'px',
    }} className={cn(className, type)}>
      {children}
    </Container>
  );
};
