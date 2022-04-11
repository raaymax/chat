const { genToken, genHash } = require('../tools');
const sessionRepo = require('./sessionRepository');
const userRepo = require('./userRepository');
const Errors = require('../errors');

async function createSession(userId) {
  const secret = genToken();
  const token = genHash(secret);
  const [session] = await sessionRepo.insert({ token, userId });
  return { id: session.id, secret };
}
async function refreshSession(session) {
  const { id } = session;
  const secret = genToken();
  const token = genHash(secret);
  await sessionRepo.update(id, { token });
  return { id, secret };
}

async function userLogin(login, password) {
  const user = await userRepo.get({ login, password: genHash(password) });
  if (!user) return {};
  const session = await createSession(user.id);
  return { session, user };
}

async function sessionRestore({ id = '', secret }) {
  const session = await sessionRepo.get({ id });
  if (session) {
    if (session.token === genHash(secret)) {
      const newSession = await refreshSession(session);
      return { session: newSession, user: session.user };
    }
    await sessionRepo.delete({ userId: session.userId });
    throw Errors.SessionTerminated('Hack!?!');
  }
  throw Errors.SessionNotFound();
}

setTimeout(async () => {
  try {
    await userRepo.ping();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}, 10000);

module.exports = {
  sessionRestore,
  userLogin,
};
