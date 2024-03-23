const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const config = require('@quack/config');
const access = require('./access');
const files = require('./files');
const sess = require('./session');
const corsConfig = require('./cors');
const users = require('./users');

const app = express();
app.set('trust proxy', config.trustProxy);
app.use(bodyParser.json());
app.use(cors(corsConfig));
app.use(compression());
app.use(sess.sessionMiddleware);
app.get('/ping', (req, res) => res.status(204).send());
app.use('/access', access);
app.use('/files', files);
app.use('/users', users);
app.use('/plugins/:pluginName', (req, res, next) => express.static(`../../plugins/${req.params.pluginName}/dist/`)(req, res, next));

app.use(express.static('../app/dist'));

module.exports = app;
