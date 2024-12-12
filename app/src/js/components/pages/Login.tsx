import { useCallback, useEffect, useState } from 'react';
import { UserProvider } from '../contexts/user';
import { client } from '../../core'
import styled, { useTheme } from 'styled-components';
import { useThemeControl } from '../contexts/useThemeControl';

type LoginProps = {
  children: React.ReactNode;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background-color: ${({theme}) => theme.Chatbox.Background};
  color: ${({theme}) => theme.Text};

  .image-container {
    flex: 1;
    .image{
      vertical-align: middle;
      text-align: center;
      margin-top: 50vh;
      transform: translateY(-50%);
      img {
        width: 80%;
        height: auto;
      }
    }
  }


  .form-container {
    flex: 1;
    .form {
      display: flex;
      flex-direction: column;
      margin: auto;
      gap: 12px;
      max-width: 380px;
      margin-top: 50vh;
      transform: translateY(-50%);
      padding: 16px;
      form, .form-group {
        display: flex;
        flex-direction: column;
      }
      form {
        gap: 16px;
      }
    }
  }

  h1 {
    color: ${({theme}) => theme.Text};
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: 48px; /* 120% */
    align-self: stretch;
    padding: 0;
    margin: 0;
  }

  p {
    color: ${({theme}) => theme.Labels};
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
  }

  label {
    color: ${({theme}) => theme.Text};
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px; /* 150% */
    padding: 0px 16px;
    margin-bottom: 5px;
  }
  input {
    border-radius: 8px;
    color: ${({theme}) => theme.Text};
    border: 1px solid ${({theme}) => theme.Strokes};
    background: ${({theme}) => theme.Input.Background};
    height: 48px;
    padding: 8px 16px;
  }
  input::placeholder {
    color: ${({theme}) => theme.Labels};
  }

  .submit {
    margin-top: 24px;
    background: var(--brand-color, #FF8C00);
  }

  @media (max-width: 720px) {
    flex-direction: column;
    height: 100vh
    max-height: 100vh;
    gap: 24px;
    .image-container {
      flex: 0 200px;
      .image {
        margin-top: 24px;
        transform: translateY(0);
        img {
          width: 60%;
        }
      }
    }
    .form-container {
      flex: 1 50%;
      .form {
        margin-top: 0;
        transform: translateY(0);
      }
    }

  } 
  
`

export const Login = ({ children }: LoginProps) => {
  const [status, setStatus] = useState('pending');
  const [userId, setUser] = useState<string | null>(null);
  const [localMsg] = useState(localStorage.getItem('loginMessage'));
  const [msg, setMsg] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    localStorage.removeItem('loginMessage');
  });


  const validate = useCallback(() => client.api.validateSession()
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
    const myuser = client.api.me();
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
    const ret = await client.api.login(value);
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
    <Container >
      <div className='image-container'>
        <div className='image'>
          <img src={theme.loginIlustration} alt='logo' />
        </div>
      </div>
      <div className='form-container'>
        <div className='form'>
          <h1>Welcome back!</h1>
          <p>Log-in to your quack account</p>
          {localMsg && <div className='message'>
            {localMsg}
          </div>}
          <form onSubmit={onSubmit}>
            <div className='form-group'>
              <label htmlFor="login">E-mail</label>
              <input id="login" type='text' name='login' placeholder='user@example.com' />
            </div>
            <div className='form-group'>
              <label htmlFor="password">Password</label>
              <input id="password" type='password' name='password' placeholder='password' />
            </div>
            <input className="submit" type='submit' value='LOG-IN' />
          </form>
          {msg && <div className='err'>
            {msg}
          </div>}
        </div>
      </div>
    </Container>
  );
};
