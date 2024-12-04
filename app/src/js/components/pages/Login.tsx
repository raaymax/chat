import { useCallback, useEffect, useState } from 'react';
import * as session from '../../services/session';
import { UserProvider } from '../contexts/user';
import '../../../assets/styles/login.css';

type LoginProps = {
  children: React.ReactNode;
};

export const Login = ({ children }: LoginProps) => {
  const [status, setStatus] = useState('pending');
  const [userId, setUser] = useState<string | null>(null);
  const [localMsg] = useState(localStorage.getItem('loginMessage'));
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    localStorage.removeItem('loginMessage');
  });


  const validate = useCallback(() => session.validate()
    .then(async ({ status: validationStatus, user: validatedUser }) => {
      setStatus(validationStatus);
      if (validationStatus === 'ok') {
        setUser(validatedUser);
      } else {
        setUser(null);
      }
    }).catch((e) => {
      console.error(e);
      setTimeout(validate, 1000);
    }), []);

  const fastAccess = useCallback(() => {
    const myuser = session.me();
    if (myuser) {
      setStatus('ok');
      setUser(myuser);
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
    const value = Object.fromEntries(fd.entries()) as { login: string, password: string };
    const ret = await session.login(value);
    if (ret.status === 'ok') {
      window.location.reload();
    } else {
      setMsg(ret.message);
    }
  };

  if (status === 'pending') return 'Auth - pending';

  return userId ? (
    <UserProvider value={userId}>
      {children}
    </UserProvider>
  ) : (
    <div className='login' >
      {localMsg && <div className='message'>
        {localMsg}
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
