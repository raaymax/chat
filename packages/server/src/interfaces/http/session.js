const cookie = require('cookie');
const uid = require('uid-safe').sync;
const repo = require('../../infra/repositories');

function parseSessionToken(req) {
  if (req.headers.Authorization) {
    return req.headers.Authorization.split(/:[\s]*/)[1];
  }
  if (req.auth?.token) {
    return req.auth.token;
  }
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.tok;
}

function saveCookie(req, res) {
  res.setHeader('Set-Cookie', cookie.serialize('tok', req.token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'strict',
    secure: true,
  }));
}

function removeCookie(res) {
  res.setHeader('Set-Cookie', cookie.serialize('tok', '', {
    httpOnly: true,
    maxAge: 0,
    sameSite: 'strict',
    secure: true,
  }));
}

async function createSession(req, res, userId) {
  req.token = uid(24);
  req.userId = userId;
  const session = {
    userId,
    token: req.token,
    lastIp: req.ip,
    lastUserAgent: req.headers['user-agent'],
  };
  saveCookie(req, res);
  const id = await repo.session.create(session);
  return repo.session.get({ id });
}

async function updateSession(req) {
  return repo.session.update({ id: req.session.id }, req.session);
}

async function deleteSession(req, res) {
  removeCookie(res);
  return repo.session.remove({ id: req.session.id });
}

async function getSession(req) {
  const token = parseSessionToken(req);
  if (token) {
    return repo.session.getByToken(token);
  }
  return null;
}

async function sessionMiddleware(req, res, next) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', 0);
  req.createSession = (userId) => createSession(req, res, userId);
  const token = parseSessionToken(req);
  if (token) {
    const record = await repo.session.getByToken(token);
    if (record?.userId) {
      req.userId = record.userId;
      req.session = record;
      req.updateSession = () => updateSession(req);
      req.deleteSession = () => deleteSession(req, res);
    }
  }
  next();
}

module.exports = {
  getSession,
  sessionMiddleware,
};
