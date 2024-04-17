import styled from 'styled-components';
import { useSize } from '../contexts/useSize';
import { cn, ClassNames } from '../../utils';

type TextProps = {
  className?: ClassNames;
  size?: number;
  children: React.ReactNode;
}

const StyledText = styled.span`
  margin: auto;
  padding: 3px;
  vertical-align: middle;
  text-align: left;
  display: inline;
`;

export const Text = ({ size, className, children}: TextProps) => {
  const $size = useSize(size);
  return (
    <StyledText className={cn('text', className)} style={$size ? {
        height: `${$size}px`,
        lineHeight: `${$size}px`,
        fontSize: `${$size}px`,
      }: undefined} >
      {children}
    </StyledText>
  );
}
