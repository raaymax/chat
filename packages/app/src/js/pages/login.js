import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { me, login } from '../services/session';
import { UserContext } from '../contexts/user';

export const Login = ({children}) => {
  const [status, setStatus] = useState('pending');
  const [user, setUser] = useState(null);
  const reload = useCallback(() => me()
    .then(async ({status, user}) => {
      setStatus(status);
      if (status === 'ok') {
        setUser(user);
      }
    }), []);
  useEffect(() => {
    reload()
      .catch( (e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setTimeout(reload, 100);
      });
  }, [reload]);

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const fd = new FormData(e.target);
    const value = Object.fromEntries(fd.entries());
    const { status, token } = await login(value);
    localStorage.setItem('token', token);
    if (status === 'ok') {
      window.location.reload(true);
    }
  };

  if (status === 'pending') return 'Auth - pending';

  return user ? (
    <UserContext value={user}>
      {children}
    </UserContext>
  ) : (
    <div class='login'>
      <form onsubmit={onSubmit}>
        <input type='text' name='login' placeholder='user@example.com' />
        <input type='password' name='password' placeholder='password' />
        <input type='submit' value='Login' />
      </form>
    </div>
  );
}
