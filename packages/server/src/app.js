const express = require('express');

const app = express();

// eslint-disable-next-line no-console
// app.use((req, res, next) => console.log(req.url) || next());
app.use(express.static('../app/dist'));

module.exports = app;