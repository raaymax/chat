import { useCallback, useEffect, useState } from 'react';
import * as session from '../../services/session';
import { UserProvider } from '../contexts/user';
import '../../../assets/styles/login.css';

type LoginProps = {
  children: React.ReactNode;
};

export const Login = ({ children }: LoginProps) => {
  const [status, setStatus] = useState('pending');
  const [user, setUser] = useState<string | null>(null);
  const [msg, setMsg] = useState(null);
  const validate = useCallback(() => session.validate()
    .then(async ({ status, user }) => {
      setStatus(status);
      if (status === 'ok') {
        setUser(user);
      } else {
        setUser(null);
      }
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      setTimeout(validate, 1000);
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
    fastAccess();
    validate();
  }, [validate, fastAccess]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const fd = new FormData(e.target as HTMLFormElement);
    const value = Object.fromEntries(fd.entries());
    const ret = await session.login(value);
    if (ret.status === 'ok') {
      window.location.reload();
    } else {
      setMsg(ret.message);
    }
  };

  if (status === 'pending') return 'Auth - pending';

  const loginMessage = localStorage.getItem('loginMessage');
  return user ? (
    <UserProvider value={user}>
      {children}
    </UserProvider>
  ) : (
    <div className='login' >
      {loginMessage && <div className='message'>
        {loginMessage}
      </div>}
      <form onSubmit={onSubmit}>
        <input type='text' name='login' placeholder='user@example.com' />
        <input type='password' name='password' placeholder='password' />
        <input type='submit' value='Login' />
      </form>
      {msg && <div className='err'>
        {msg}
      </div>}
    </div>
  );
};
