import {h} from 'preact';
import {useEffect, useState, useCallback} from 'preact/hooks';
//import {client} from '../../core';

const me = async () => {
  const ret = await fetch('/session', {
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
  const ret = await fetch(e.target.getAttribute('action'), {
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
  await fetch('/session', {
    method: 'DELETE',
    credentials: 'include',
  });
}

export const Login = ({children}) => {
  const [status, setStatus] = useState('pending');
  const [user, setUser] = useState(null);
  useEffect(() => {
    me()
      .then(async ({status, user, token}) => {
        //if (token) await client.req({type: 'auth', token});
        setStatus(status);
        if (status === 'ok') {
          setUser(user);
          //client.emit('auth:user', user);
          //client.emit('auth:ready');
        }
      })
      .catch( (e) => console.error(e));
  }, []);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const {
      status, user,
    } = await submit(e);
    if (status === 'ok') {
      setUser(user);
      //client.emit('auth:user', user);
      //client.emit('auth:ready');
    }
  }, [user]);

  const onLogout = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await logout(e);
    setUser(null);
  }, [user]);

  if (status === 'pending') return 'Loading';

  return user ? (children) : (
    <div class='login'>
      <form method='POST' action='/session' onsubmit={onSubmit}>
        <input type='text' name='login' placeholder='user@example.com' />
        <input type='password' name='password' />
        <input type='submit' value='Login' />
      </form>
    </div>
  );
}
