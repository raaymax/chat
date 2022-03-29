const {knex} = require('../database/db');
const {genToken, genHash} = require('../tools');
const sessionRepo = require('./sessionRepository');
const userRepo = require('./userRepository');

async function createSession(userId) {
  const secret = genToken();
  const token = genHash(secret);
  const [session] = await sessionRepo.insert({token, userId});
  return {id: session.id, secret};
}
async function refreshSession(session) {
  const id = session.id;
  const secret = genToken();
  const token = genHash(secret);
  await sessionRepo.update(id, {token});
  return {id, secret};
}

async function login(login, password) {
  const user = await userRepo.get({login, password: genHash(password)});
  if(!user) return {};
  const session = await createSession(user.id);
  return { session, user };
}

async function sessionRestore({id = '', secret}) {
  try{
    //console.log(id, secret);
    //console.log(await knex('sessions').select());
    //console.log(sessionRepo.get({id}).toString());
    const session = await sessionRepo.get({id});
    //console.log(session);
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
  }catch(err){
    console.error(err);
    return null;
  }
}


module.exports = {
  sessionRestore,
  login,
}
