const {genToken, genHash} = require('../tools');
const sessionRepo = require('./sessionRepository');
const userRepo = require('./userRepository');

async function createSession(userId) {
  const series = genToken();
  const secret = genToken();
  const token = genHash(secret);
  await sessionRepo.insert({series, token, userId});
  return {series, secret};
}
async function refreshSession(session) {
  const series = session.series;
  const secret = genToken();
  const token = genHash(secret);
  await sessionRepo.update(series, {token});
  return {series, secret};
}

async function login(login, password) {
  const user = await userRepo.get({login, password: genHash(password)});
  if(!user) return;
  const session = await createSession(user.id);
  return { session, user };
}

async function sessionRestore({series, secret}) {
  const session = await sessionRepo.get({series});
  if(session){
    if(session.token === genHash(secret)){
      const newSession = await refreshSession(session);
      return {session: newSession, user: session.user};
    }else {
      await sessionRepo.delete({userId: session.userId});
      return null;
    }
  }
  return null;
}

module.exports = {
  sessionRestore,
  login,
}
