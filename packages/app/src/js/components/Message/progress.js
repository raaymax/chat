import { h } from 'preact';
import styled from 'styled-components';
import { useMessageData } from '../../contexts/message';

const StyledProgress = styled.div`
  position: relative;
  height: 0;
  width: 100%;

  & div {
    position: absolute;
    bottom: -20px;
    right: 0;

    img {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
  }
`

export const Progress = () => {
  const {progress = []} = useMessageData();

  if (!progress) return null;

  return (
    <StyledProgress>
      <div>
        {
          progress
            .map((p) => (
              <img key={p.userId} src={p.user?.avatarUrl} alt={p.user?.name} />
            ))
        }
      </div>
    </StyledProgress>
  )
}
