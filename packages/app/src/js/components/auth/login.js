import {h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import {client} from '../../core';
import {me, login, logout} from '../../services/session';

// eslint-disable-next-line no-undef
const SESSION_URL = `${SERVER_URL}/session`;

export const Login = ({children}) => {
  let logs;
  const [status, setStatus] = useState('pending');
  const [user, setUser] = useState(null);
  useEffect(() => {
    console.log('server url', SESSION_URL)
    me()
      .then(async ({status, user}) => {
        console.log(status, user);
        setStatus(status);
        if (status === 'ok') {
          setUser(user);
          client.emit('auth:user', user);
        }
      })
      .catch( (e) => { logs = e.toString(); console.error(e) });
  }, []);

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

  const onLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await logout(e);
    setUser(null);
  };

  if (status === 'pending') return 'Loading';

  return user ? (children) : (
    <div>
      <form method='POST' action={SESSION_URL} onsubmit={onSubmit}>
        <input type='text' name='login' placeholder='user@example.com' />
        <input type='password' name='password' />
        <input type='submit' />
      </form>

      {logs && <pre>{logs}</pre>}
    </div>
  );
}
