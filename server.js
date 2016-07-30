'use strict';
var express = require('express');
var app = express();
var mysql = require('mysql');
var conf = require('./backend/config');
var pool = mysql.createPool(conf);
var rating = require('./backend/Models/RatingModel')(pool);
var bodyParser = require('body-parser');
var internetradio = require('node-internet-radio');
var utils = require('./backend/Utils');
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
  var result;
    console.log('something1');
  internetradio.getStationInfo('http://178.236.141.243:8000/live', function (error, station) {
    console.log('something');
    if (!error) {
      result = utils.TitleParcing.call(station);
      self.send(result);
    } else {
      self.send({ type: 'error' });
    }
  });
});

app.post('/Rating/Save', function (req, res) {
  console.log('Start');
  rating.SaveRating({
    id: '1',
    autor: 'test',
    song: 'song_test',
    album: 'album_test',
    dateCreate: new Date(),
    rate: 9,
    userTempId: '123456789012345678901234567890123456',
  }, function (error, data) {
    if (!error)
      console.log(data);
    else
      console.log(error);
  });
});

app.listen(10001, function () {
  console.log('Server successfully started on 10001 port');
});
