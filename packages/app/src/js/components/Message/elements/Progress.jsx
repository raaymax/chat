import styled from 'styled-components';
import PropTypes from 'prop-types';

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
`;

export const Progress = ({ progress }) => {
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
  );
};

Progress.propTypes = {
  progress: PropTypes.arrayOf(PropTypes.shape({
    userId: PropTypes.string,
    user: PropTypes.shape({
      avatarUrl: PropTypes.string,
      name: PropTypes.string,
    }),
  })),
};
