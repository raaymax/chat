const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const session = require('./session');
const files = require('./files');
const sessionParser = require('./sessionParser');
const corsConfig = require('./cors');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply the rate limiting middleware to all requests
app.use(helmet());
app.use(limiter);
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
