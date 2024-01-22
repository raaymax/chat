const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const config = require('@quack/config');
const session = require('./session');
const files = require('./files');
const sessionParser = require('./sessionParser');
const corsConfig = require('./cors');

const app = express();
app.set('trust proxy', config.trustProxy);
app.use(bodyParser.json());
app.use(cors(corsConfig));
app.use(compression());
app.use(sessionParser);
app.get('/ping', (req, res) => res.status(204).send());
app.use('/session', session);
app.use('/files', files);
app.use('/plugins/:pluginName', (req, res, next) => express.static(`../../plugins/${req.params.pluginName}/dist/`)(req, res, next));

app.use(express.static('../app2/dist'));

module.exports = app;
