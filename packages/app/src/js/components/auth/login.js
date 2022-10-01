import { h } from 'preact';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { client } from '../../core';
import { me, login } from '../../services/session';

export const Login = ({children}) => {
  const [status, setStatus] = useState('pending');
  const [user, setUser] = useState(null);
  const reload = useCallback(() => me()
    .then(async ({status, user}) => {
      setStatus(status);
      if (status === 'ok') {
        setUser(user);
        client.emit('auth:user', user);
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
    const { status } = await login(value);
    if (status === 'ok') {
      window.location.reload(true);
    }
  };

  if (status === 'pending') return 'Loading';

  return user ? (children) : (
    <div class='login'>
      <form onsubmit={onSubmit}>
        <input type='text' name='login' placeholder='user@example.com' />
        <input type='password' name='password' placeholder='password' />
        <input type='submit' value='Login' />
      </form>
    </div>
  );
}
