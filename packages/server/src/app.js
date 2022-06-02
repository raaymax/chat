/* eslint-disable indent */
const express = require('express');
const cors = require('cors');
const config = require('../../../chat.config');
const session = require('./http/session');
const bodyParser = require('body-parser');

const app = express();

app.set('trust proxy', true);
app.use(bodyParser.json());

app.use(cors({
  origin: config.cors,
}));

app.use('/session', session)

// eslint-disable-next-line no-console
// app.use((req, res, next) => console.log(req.url) || next());
app.use(express.static('../app/dist'));

module.exports = app;
