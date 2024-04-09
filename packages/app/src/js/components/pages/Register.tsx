import { useCallback, useState } from 'react';
import * as session from '../../services/session';
import '../../../assets/styles/register.css';

export const Register = () => {
  const url = new URL(window.location.toString());
  const m = url.hash.match('/invite/(.*)');
  const token = m && m[1];

  const [msg, setMsg] = useState(null);

  const submit = useCallback(async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { name, login, password } = e.target as typeof e.target & { 
      name: {value: string},
      login: {value: string},
      password: {value: string},
    };

    const ret = await session.register({
      name: name.value,
      login: login.value,
      password: password.value,
      token,
    });
    if (ret.status === 'ok') {
      localStorage.setItem('token', '');
      localStorage.setItem('loginMessage', 'Registration successful. You can login now.');
      window.location.href = '/';
    } else {
      setMsg(ret.message);
    }
  }, [token]);

  if (!token) {
    return (
      <div className='register' >
        <div className='err'>
          Missing registration token
        </div>
      </div>
    );
  }
  return (
    <div className='register' >
      <form onSubmit={submit}>
        <input type='text' name='name' placeholder='Your name' />
        <input type='text' name='login' placeholder='user@example.com' />
        <input type='password' name='password' placeholder='password' />
        <input type='submit' value='Register' />
      </form>
      {msg && <div className='err'>
        {msg}
      </div>}
    </div>
  );
};
