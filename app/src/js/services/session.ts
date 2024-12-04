//
// const SESSION_URL = `${API_URL}/access`;
const SESSION_URL = `${API_URL}/api/auth/session`;
let fetch: any = window.fetch;
console.log('window.isTauri', window.isTauri);
console.log(await (await fetch('http://tauri.localhost/api/auth/session', {method: "POST", headers: {'content-type': 'application/json'}, body: JSON.stringify({login: 'admin', password: '123'})})).text());
if(window.isTauri) {
  
  const http = await import('@tauri-apps/plugin-http');
  console.log('http', http);
  window.http = http;
    
  fetch = http.fetch;
}

export const isProbablyLogged = () => !!localStorage.token;

export const me = () => localStorage.getItem('userId');

export const validate = async () => {
  const ret = await fetch(SESSION_URL, {
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${localStorage.token}`,
      'Content-Type': 'application/json',
    },
  });
  const user = await ret.json();
  if (user.status === 'ok') {
    localStorage.setItem('userId', user.user);
    localStorage.setItem('token', user.token);
  }
  return user;
};

export const login = async (value: {login: string, password: string}) => {
  const ret = await fetch(SESSION_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  });
  const json = await ret.json();
  localStorage.setItem('token', json.token);
  return json;
};

export const checkRegistrationToken = async (value: { token: string }) => {
  const ret = await fetch(`${API_URL}/api/users/token/${value.token}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await ret.json();
};

export const register = async (value: { name: string, email: string, password: string, token: string }) => {
  const ret = await fetch(`${API_URL}/api/users/${value.token}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  });
  if (ret.status !== 200) {
    throw await ret.json();
  }
  return await ret.json();
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  const ret = await fetch(SESSION_URL, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '{}',
  });
  await ret.body?.cancel();
  window.location.reload();
};
