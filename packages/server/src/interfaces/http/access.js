const express = require('express');
const rateLimit = require('express-rate-limit');
const userService = require('../../app/user');

const router = new express.Router();
if (process.env.NODE_ENV !== 'test') {
  router.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }));
}

router.post('/', createSession);
router.delete('/', deleteSession);
router.get('/', getSession);

async function getSession(req, res) {
  if (req.userId) {
    res.status(200).send({ status: 'ok', user: req.session.userId, token: req.session.token });
  } else {
    res.status(200).send({ status: 'no-session' });
  }
}

async function deleteSession(req, res) {
  await req.deleteSession();
  res.status(204).send();
}

async function createSession(req, res) {
  try {
    const user = await userService.login(req.body.login, req.body.password);
    if (user) {
      const session = await req.createSession(user.id);
      return res.status(200).send({ status: 'ok', user, token: session.token });
    }
    res.status(401).send({ status: 'nok', message: 'Invalid credentials' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send({ errorCode: 'INTERNAL_SERVER_ERROR' });
  }
}

module.exports = router;
