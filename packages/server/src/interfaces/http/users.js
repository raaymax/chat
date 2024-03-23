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

router.post('/', createUser);

async function createUser(req, res) {
  try {
    const userId = await userService.create(req.body);
    res.status(200).send({ status: 'ok', user: userId });
  } catch (e) {
    res.status(400).send({ status: 'error', message: e.message });
  }
}
module.exports = router;
