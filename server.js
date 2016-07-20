'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var internetradio = require('node-internet-radio');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers',
  'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
});

app.get('/', function (req, res) {
  res.render('index');
});

app.post('/', function (req, res) {
  var self = res;
  internetradio.getStationInfo('http://nashe64.streamr.ru', function (error, station) {
    console.log(station);
    self.send(station);
  });
});

app.listen(10000, function () {
  console.log('Server successfully started on 10000 port');
});
