import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import * as session from '../services/session';
import { UserContext } from '../contexts/user';

export const Login = ({children}) => {
  const [status, setStatus] = useState('pending');
  const [user, setUser] = useState(null);
  const validate = useCallback(() => session.validate()
    .then(async ({status, user}) => {
      setStatus(status);
      if (status === 'ok') {
        setUser(user);
      } else {
        setUser(null);
      }
    }).catch( (e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      setTimeout(validate, 100);
    }), []);

  const fastAccess = useCallback(() => {
    const user = session.me();
    if (user) {
      setStatus('ok');
      setUser(user);
      setTimeout(validate, 100);
    }
  }, [validate]);

  useEffect(() => {
    fastAccess()
    validate()
  }, [validate, fastAccess]);

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const fd = new FormData(e.target);
    const value = Object.fromEntries(fd.entries());
    const { status, token } = await session.login(value);
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
    <div class='login' >
      <form onsubmit={onSubmit}>
        <input type='text' name='login' placeholder='user@example.com' />
        <input type='password' name='password' placeholder='password' />
        <input type='submit' value='Login' />
      </form>
    </div>
  );
}
