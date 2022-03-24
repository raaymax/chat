
export const getSession = () => {
  try{
    return JSON.parse(localStorage.getItem('session'));
  }catch(err){
    return null;
  }
}

export const setSession = (session) => {
  localStorage.setItem('session', JSON.stringify(session));
}
