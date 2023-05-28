const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const userService = require('../../app/user');
const db = require('../../infra/repositories');

const router = new express.Router();
if (process.env.NODE_ENV !== 'test') {
  router.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }));
}

router.post('/register', createUser);
router.post('/', createSession);
router.delete('/', deleteSession);
router.get('/', getSession);

async function createUser(req, res) {
  try {
    const userId = await userService.create(req.body);
    res.status(200).send({ status: 'ok', user: userId });
  } catch (e) {
    res.status(400).send({ status: 'error', message: e.message });
  }
}

async function getSession(req, res) {
  if (req.session.userId) {
    res.status(200).send({ status: 'ok', user: req.session.userId });
  } else {
    const token = req.headers?.authorization?.split(' ')[1];
    if (token) {
      const record = await db.session.getByToken(token);
      if (record?.session?.userId) {
        return res.status(200).send({ status: 'ok', user: record.session.userId });
      }
    }
    res.status(200).send({ status: 'no-session' });
  }
}

async function deleteSession(req, res) {
  await req.session.destroy();
  res.status(204).send();
}

async function createSession(req, res) {
  try {
    const user = await userService.login(req.body.login, req.body.password);
    if (user) {
      req.session.userId = user.id;
      req.session.token = crypto.randomBytes(64).toString('hex');
      return res.status(200).send({ status: 'ok', user, token: req.session.token });
    }
    res.status(401).send({ status: 'nok', message: 'Invalid credentials' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send({ errorCode: 'INTERNAL_SERVER_ERROR' });
  }
}

module.exports = router;
