import {useDispatch} from 'react-redux';
import { logout } from '../../services/session';

export const LogoutButton = () => {
  const dispatch = useDispatch();
  return (

    <div className='logout' onClick={() => {
      dispatch(logout());
    } }>
      <i className="fa-solid fa-right-from-bracket" />
            Logout
    </div>
  );
}
