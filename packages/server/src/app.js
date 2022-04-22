const express = require('express');

const app = express();

app.set('trust proxy', true);

// eslint-disable-next-line no-console
// app.use((req, res, next) => console.log(req.url) || next());
app.use(express.static('../app/dist'));

module.exports = app;
