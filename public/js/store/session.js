
export const getSession = () => {
  try{
    return JSON.parse(localStorage.getItem('session'));
  }catch(err){
    console.error(err);
    return null;
  }
}

export const setSession = (session) => {
  console.log('setSession', session);
  localStorage.setItem('session', JSON.stringify(session));
}

export const clearSession = () => {
  console.log('clearSession');
  localStorage.removeItem('session');
}
