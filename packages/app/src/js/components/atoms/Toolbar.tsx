import styled from 'styled-components';
import { SizeProvider } from '../contexts/size';
import {cn, ClassNames} from '../../utils';

export const Container = styled.div<{$size?: number}>`
  display: flex;
  flex-direction: row;
  .icon, .emoji {
    flex: 0;
  }
  .icon, .emoji, .separator {
    height: ${(props) => props.$size}px;
    width: ${(props) => props.$size}px;
    line-height: ${(props) => props.$size}px;
  }
  .separator {
    flex: 1;
    padding-left: 10px;
    display: inline-block;
  }
`;

interface ToolbarProps {
  className?: ClassNames;
  size?: number;
  children: React.ReactNode;
}

export const Toolbar = ({ children, size, className}: ToolbarProps) => {
  const stop = (e: any) => { e.stopPropagation(); e.preventDefault(); };
  return (
    <Container className={cn(className)} $size={size} onClick={stop}>
      <SizeProvider value={size}>
        {children}
      </SizeProvider>
    </Container>
  );
}
