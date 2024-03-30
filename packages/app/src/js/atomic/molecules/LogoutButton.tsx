import {useDispatch} from 'react-redux';
import { logout } from '../../services/session';
import { ButtonWithIcon } from '../../atomic/molecules/ButtonWithIcon';
import {Text} from '../atoms/Text';
import styled from 'styled-components';
import {useSize} from '../../contexts/size';

const StyledButton = styled(ButtonWithIcon)`
  text-align: left;
  width: 100%;
  padding-left: 20px;
  cursor: pointer;

  .text {
    padding-left: 5px;
  }
  &:hover {
    background-color: ${(props) => props.theme.highlightedBackgroundColor};
  }
   
`

type LogoutButtonProps = {
  size?: number;
} 

export const LogoutButton = ({size}: LogoutButtonProps) => {
  const dispatch = useDispatch();
  const $size = useSize(size) ?? 50;
  return (
    <StyledButton className="logout" icon="logout" size={$size} onClick={() => dispatch(logout())}>
      <Text size={$size/2.5}>Logout</Text>
    </StyledButton>
  );
}
