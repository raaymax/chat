const express = require('express');
const userService = require('../../user');

const router = new express.Router();

router.post('/', createSession);
router.delete('/', deleteSession);
router.get('/', getSession);

async function getSession(req, res) {
  if (req.session.userId) {
    res.status(200).send({ status: 'ok', user: req.session.userId });
  } else {
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
      return res.status(200).send({ status: 'ok', user });
    }
    res.status(401).send({ status: 'nok' });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).send(err);
  }
}

module.exports = router;
