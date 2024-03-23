/* eslint-disable no-undef */

const SESSION_URL = `${API_URL}/access`;

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

export const login = async (value) => {
  const ret = await fetch(SESSION_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  });
  const json = ret.json();
  localStorage.setItem('token', json.token);
  return json;
};

export const register = async (value) => {
  const ret = await fetch(`${API_URL}/users`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value),
  });
  return ret.json();
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  await dispatch({type: 'logout'});
  await fetch(SESSION_URL, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  window.location.reload();
};
