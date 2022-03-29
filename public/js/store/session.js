export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem('session'));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return null;
  }
};

export const setSession = (session) => {
  localStorage.setItem('session', JSON.stringify(session));
};

export const clearSession = () => {
  localStorage.removeItem('session');
};
