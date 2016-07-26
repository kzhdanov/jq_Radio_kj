'use strict';

var express = require('express');
var app = express();
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
  //internetradio.getStationInfo('http://178.236.141.243:8000/live', function (error, station) {
  //  if(!error) {
      var station = {
        title: "Автор  ₽ Песня  ₽   Альбом  "
      }

      if(utils.HasChange(station)) {
        result = utils.TitleParcing.call(station);
        self.send(result);
      } else {
        console.log('test');
        self.send(null);
      }
  //  };
  //});
});


app.listen(10001, function () {
  console.log('Server successfully started on 10001 port');
});
