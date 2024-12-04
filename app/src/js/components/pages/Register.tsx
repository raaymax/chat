import { useCallback, useState, useEffect } from 'react';
import * as session from '../../services/session';
import '../../../assets/styles/register.css';

export const Register = () => {
  const url = new URL(window.location.toString());
  const m = url.hash.match('/invite/(.*)');
  const token = m && m[1];
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState(null);


  useEffect(() => {
    if (!token) return setError('Invalid invitation link');
    session.checkRegistrationToken({ token }).then(({valid}: {valid: boolean}) => {
      if (!valid) {
        setError('Invalid invitation link');
      }else{
        setError(null);
      }
    }).catch((err: Error) => {
      setError(err.message);
    })
  }, [token]);

  const submit = useCallback(async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { name, email, password } = e.target as typeof e.target & {
      name: {value: string},
      email: {value: string},
      password: {value: string},
    };
    if (!token) return;
    try {
      await session.register({
        name: name.value,
        email: email.value,
        password: password.value,
        token,
      });

      localStorage.setItem('token', '');
      localStorage.setItem('loginMessage', 'Registration successful. You can login now.');
      window.location.href = '/';
    }catch(err){
      console.log(err);
      setMsg(err.message);
    }
  }, [token]);

  if (error) {
    return (
      <div className='register' >
        <div className='big-err'>
          {error}
        </div>
        <div className='back'>
          <a href='/'>Back to home</a>
        </div>
      </div>
    );
  }
  return (
    <div className='register' >
      <form onSubmit={submit}>
        <input type='text' name='name' placeholder='Your name' />
        <input type='text' name='email' placeholder='user@example.com' />
        <input type='password' name='password' placeholder='password' />
        <input type='submit' value='Register' />
      </form>
      {msg && <div className='err'>
        {msg}
      </div>}
    </div>
  );
};
