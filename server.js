'use strict';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var qs = require('querystring');
var internetradio = require('node-internet-radio');
var basicAuth = require('basic-auth-connect');
var mysql = require('mysql');
var conf = require('./backend/config');
var pool = mysql.createPool(conf);
var rating = require('./backend/Models/RatingModel')(pool);
var album = require('./backend/Models/AlbumModel')(pool);
var utils = require('./backend/Utils');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

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

///ГЛАВНАЯ РАДИО///
app.get('/', function (req, res) {
  res.render('Index');
});

app.post('/', function (req, res) {
  var self = res;
  var result;
  internetradio.getStationInfo('http://178.236.141.243:8000/live', function (error, station) {
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

///АДМИНИСТРАТИВНАЯ ЧАСТЬ///
var auth = basicAuth('Ivan', 'EgorLetov@!');
app.get('/RadioAdmin/', auth, function (req, res) {
  album.GetAlbumsByWeek(1, function (err, al) {
    if (!err)
      res.render('Admin.ejs', { Albums: al });
  });
});

app.post('/RadioAdmin/Get', auth, function (req, res) {
  album.GetAlbumsByWeek(req.body.week, function (err, al) {
    if (!err)
      res.render('AdminPartial.ejs', { Albums: al });
  });
});

app.post('/RadioAdmin/Save', auth, function (req, res) {
  try {
    if (req.body.album != null) {
      var reqAlbum = qs.parse(req.body.album);

      if (reqAlbum.IsVisible)
        reqAlbum.IsVisible = true;
      else
        reqAlbum.IsVisible = false;

      reqAlbum.dateCreate = new Date();
      reqAlbum.id = utils.Guid();

      album.SaveAlbum(reqAlbum, function (error, data) {
        if (!error)
          res.json({ type: 'success' });
        else
          res.json({ type: 'error' });
      });
    }
  } catch (e) {
    res.json({ type: 'error' });
  }
});

///СТРАНИЦА НЕДЕЛИ///
app.get('/weeks', function (req, res) {
  //
  var items = [
    { src: './TESTCovers/killers.jpg', title: 'The Killer - "All These Things That I\'ve Done" (UK version)', rate: '4,5', genres: 'Indy Rock', text: 'PrevText PrevText PrevText PrevText PrevText Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    { src: './TESTCovers/killers.jpg', title: 'The Killer - "All These Things That I\'ve Done" (UK version)', rate: '4,5', genres: 'Indy Rock', text: 'PrevText PrevText PrevText PrevText PrevText Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
    { src: './TESTCovers/killers.jpg', title: 'The Killer - "All These Things That I\'ve Done" (UK version)', rate: '4,5', genres: 'Indy Rock', text: 'PrevText PrevText PrevText PrevText PrevText Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
  ];
  res.render('Weeks.ejs', { items: items });
});

app.listen(10001, function () {
  console.log('Server successfully started on 10001 port');
});
