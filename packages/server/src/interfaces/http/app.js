const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('./session');
const files = require('./files');
const sessionParser = require('./sessionParser');
const corsConfig = require('./cors');

const app = express();

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(cors(corsConfig));

app.use(sessionParser);
app.get('/ping', (req, res) => res.status(204).send());
app.use('/session', session);
app.use('/files', files);

app.use(express.static('../app/dist'));

module.exports = app;
