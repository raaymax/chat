
/* eslint-disable indent */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('./session');

const config = require('../../../chat.config');

const app = express();

app.use(bodyParser.json());
app.set('trust proxy', true);

app.use(cors({
  origin: config.cors,
}));

app.use(express.static('../app/dist'));

app.use('/session', session);

module.exports = app;
