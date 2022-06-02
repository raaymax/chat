const express = require('express');
const session = require('./session');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('../../../../../chat.config');
const sessionParser = require('./sessionParser');

const app = express();

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(sessionParser);
app.use(cors({ origin: config.cors }));

app.get('/ping', (req, res) => console.log('dasduhyasidh') || res.status(204).send());
app.use('/session', session);

app.use(express.static('../app/dist'));

module.exports = app;
