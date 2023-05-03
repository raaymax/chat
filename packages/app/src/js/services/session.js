/* eslint-disable no-undef */

const SESSION_URL = `${document.location.protocol}//${document.location.host}/session`;

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
  }
  return user;
}

export const login = async (value) => {
  const ret = await fetch(SESSION_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  });
  return ret.json();
}

export const logout = async () => {
  await fetch(SESSION_URL, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
