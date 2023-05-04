const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const path = require('path');
const session = require('./session');
const files = require('./files');
const sessionParser = require('./sessionParser');
const corsConfig = require('./cors');

const app = express();
if (process.env.NODE_ENV !== 'test') {
  /*
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  */
  app.use(rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  }));
}
app.set('trust proxy', true);
app.use(bodyParser.json());
app.use(cors(corsConfig));
app.use(compression());
app.use(sessionParser);
app.get('/ping', (req, res) => res.status(204).send());
app.use('/session', session);
app.use('/files', files);

app.use(express.static('../app/dist'));

module.exports = app;
