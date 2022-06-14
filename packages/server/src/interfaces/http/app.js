const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('./session');
const files = require('./files');
const config = require('../../../../../chat.config');
const sessionParser = require('./sessionParser');

const app = express();

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(sessionParser);
app.use(cors({ origin: config.cors }));

app.get('/ping', (req, res) => res.status(204).send());
app.use('/session', session);
app.use('/files', files);

app.use(express.static('../app/dist'));

module.exports = app;
