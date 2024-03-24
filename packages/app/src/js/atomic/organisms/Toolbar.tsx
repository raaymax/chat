import { ToolButton } from '../molecules/ToolButton';
import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  top: -15px;
  height: 42px;
  right: 10px;
  z-index: 50;
  background-color: var(--primary_background);
  border: 1px solid #565856;
  border-radius: 0.3em;
  padding: 0px;
  font-size: 0.9em;
  box-sizing: border-box;

  .icon, .emoji {
    height: 40px;
    width: 40px;
    line-height: 40px;
  }

  body.mobile & {
    width: 100%;
    top: -50px;
    right: 0;
    border-radius: 0;
    border-top: 1px solid #565856;
    border-bottom: 1px solid #565856;
    border-left: 0;
    border-right: 0;
    margin: 0;
    padding: 0;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    i {
      flex: 0 50px;
      line-height: 50px;
      font-size: 25px;

    }
  }
`;

interface ToolbarProps {
  opts: {
    emoji?: string;
    icon?: string;
    handler: () => void;
  }[]
}

export const Toolbar = ({ opts }: ToolbarProps) => {
  const stop = (e: any) => { e.stopPropagation(); e.preventDefault(); };
  return (
    <Container onClick={stop}>
      {opts.map(({ emoji, icon, handler }, idx) => (
        <ToolButton key={idx} emoji={emoji} icon={icon} onClick={handler} size={40} />
      ))}
    </Container>
  );
}
