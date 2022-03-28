const express = require('express');
const app = express();

//app.use((req,res,next) => console.log(req.url) || next());
app.use(express.static('public'));

module.exports = app;
