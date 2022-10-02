/* eslint-disable no-undef */
import { Capacitor } from '@capacitor/core';

const SESSION_URL = Capacitor.isNativePlatform()
  ? `${SERVER_URL}/session`
  : `${document.location.protocol}//${document.location.host}/session`;

export const me = async () => {
  const ret = await fetch(SESSION_URL, {
    credentials: 'include',
    headers: {
      'Authorization': 'Bearer ' + localStorage.token,
      'Content-Type': 'application/json',
    },
  });
  return ret.json();
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
