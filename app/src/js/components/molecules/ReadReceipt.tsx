import styled from 'styled-components';
import { UserCircle } from '../atoms/UserCircle';

const StyledReadReceipt = styled.div`
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

type ReadReceiptProps = {
  data?: {
    userId: string;
    user: {
      avatarUrl: string;
      name: string;
    }
  }[];
};

export const ReadReceipt = ({ data }: ReadReceiptProps) => {
  if (!data) return null;

  return (
    <StyledReadReceipt>
      <div>
        {
          data
            .map((p) => (
              <UserCircle key={p.userId} userId={p.userId} />
            ))
        }
      </div>
    </StyledReadReceipt>
  );
};
