const express = require('express');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo');
const userService = require('../user/userService');
const connections = require('../connections');
const config = require('../../../../chat.config');

const router = new express.Router();

router.use(createMiddleware());
router.post('/', createSession);
router.delete('/', deleteSession);
router.get('/', getSession);

function createMiddleware() {
  return expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: config.databaseUrl, collectionName: 'http-sessions' }),
    cookie: {
      secure: 'auto',
    },
  });
}

async function getSession(req, res) {
  console.log(req.session);
  const self = connections.getBySession(req.session);
  console.log(self);
  if (self.session.userId) {
    res.status(200).send({ status: 'ok', user: self.user, token: self.connectionToken });
  } else {
    res.status(200).send({ status: 'login' });
  }
}

async function deleteSession(req, res) {
  connections.removeBySession(req.session);
  res.status(204).send();
}

async function createSession(req, res) {
  try {
    const { login, password } = req.body;
    const { user, session } = await userService.userLogin(login, password);
    if (session) {
      const self = connections.getBySession(req.session);
      self.user = user;
      self.session = session;
      return res.status(200).send({
        status: 'ok', user, session, token: self.connectionToken,
      });
    }
    res.status(401).send({ status: 'login', errorCode: 'NOT_AUTHORIZED' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send(err);
  }
}

module.exports = router;
