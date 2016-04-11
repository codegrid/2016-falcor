'use strict';
const express = require('express');
const falcorExpress = require('falcor-express');
const bodyParser = require('body-parser');
const ExampleRouter = require('./exampleRouter.js');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use('/model.json', falcorExpress.dataSourceRoute(() => new ExampleRouter()));
app.use(express.static('./'));

const server = app.listen((process.env.PORT || 3000), (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`app start, on port ${server.address().port} in ${app.get('env')} mode ${Date().toString()}`);
});
