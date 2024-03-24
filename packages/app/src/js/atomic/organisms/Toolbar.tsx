import { ToolButton } from '../molecules/ToolButton';
import styled from 'styled-components';

export const Container = styled.div<{$size: number}>`
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

interface Button {
  emoji?: string;
  icon?: string;
  handler: () => void;
}

interface Separator {
  type: 'separator';
}

interface ToolElement {
  element: React.FC;
}

interface ToolbarProps {
  className?: string;
  size?: number;
  opts: (Button | Separator | Text)[];
}

const isButton = (item: any): item is Button => item.handler !== undefined;
const isElement= (item: any): item is ToolElement=> item.element !== undefined;

export const Toolbar = ({ opts, size = 40, className}: ToolbarProps) => {
  const stop = (e: any) => { e.stopPropagation(); e.preventDefault(); };
  return (
    <Container className={className} $size={size} onClick={stop}>
      {opts.map((item, idx) => {
        if(isButton(item))
          return <ToolButton key={idx} emoji={item.emoji} icon={item.icon} onClick={item.handler} size={size} />;
        if(isElement(item)){
          const Tool = item.element;
          return <span className="separator" key={idx}><Tool /></span>;
        }
        return <span className="separator" key={idx}></span>;
      })}
    </Container>
  );
}
