import {h} from 'preact';
import {useEffect, useState} from 'preact/hooks';
import {client} from '../../core';

const me = async () => {
  const ret = await fetch(`${SERVER_URL}/session`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return ret.json();
}
const submit = async (e) => {
  const fd = new FormData(e.target);
  const value = Object.fromEntries(fd.entries());
  const ret = await fetch(`${SERVER_URL}/session`, {
    method: e.target.getAttribute('method'),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  });
  return ret.json();
}
const logout = async () => {
  await fetch(`${SERVER_URL}/session`, {
    method: 'DELETE',
    credentials: 'include',
  });
}

export const Login = ({children}) => {
  const [status, setStatus] = useState('pending');
  const [user, setUser] = useState(null);
  useEffect(() => {
    console.log('server url', `${SERVER_URL}/session`)
    me()
      .then(async ({status, user}) => {
        setStatus(status);
        if (status === 'ok') {
          setUser(user);
          client.emit('auth:user', user);
        }
      })
      .catch( (e) => {logs = e.toString(); console.error(e)});
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {
      status, user, session,
    } = await submit(e);
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
      <form method='POST' action={`${SERVER_URL}/session`} onsubmit={onSubmit}>
        <input type='text' name='login' placeholder='user@example.com' />
        <input type='password' name='password' />
        <input type='submit' />
      </form>

      {logs && <pre>{logs}</pre>}
    </div>
  );
}
