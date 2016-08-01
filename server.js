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
app.set('views', __dirname + '/public/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers',
  'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
  next();
});

///ГЛАВНАЯ РАДИО///
///ГЛАВНАЯ
app.get('/', function (req, res) {
  res.render('Index');
});

///ТУТ БЕР[Е]М ЗАГОЛОВКИ
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

///АДМИНКА
app.get('/RadioAdmin/', auth, function (req, res) {
  album.GetLastWeekNumber(null, function (err, weekNumber) {
    if (!err) {
      album.GetAlbumsByWeekAll(weekNumber[0].Number, function (err, al) {
        if (!err)
          res.render('Admin.ejs', { Albums: al });
      });
    } else {
      console.log(error);
    }
  });
});

///ПОИСК
app.post('/RadioAdmin/Get', auth, function (req, res) {
  album.GetAlbumsByWeekAll(req.body.week, function (err, al) {
    if (!err)
      res.render('AdminPartial.ejs', { Albums: al });
  });
});

///СОХРАНЕНИЕ НОВОГО ЭЛЕМЕНТА
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

///ПОЛУЧЕНИЕ СУЩЕТВУЮЩЕЙ СУЩЬНОСТИ ДЛЯ РЕДАКТИРОВАНИЯ
app.post('/RadioAdmin/Edit', auth, function (req, res) {
  try {
    if (req.body.id != null) {
      album.GetAlbumById(req.body.id, function (err, data) {
        if (!err)
          res.json({ type: 'success', data: data });
        else
          res.json({ type: 'error' });
      });
    }
  } catch (e) {
    res.json({ type: 'error' });
  }
});

///РЕДАКТИРОВАНИЕ СУЩЕТВУЮЩЕЙ СУЩЬНОСТИ
app.post('/RadioAdmin/EditSave', auth, function (req, res) {
  try {
    if (req.body.album) {
      var reqAlbum = qs.parse(req.body.album);

      if (reqAlbum.IsVisible)
        reqAlbum.IsVisible = true;
      else
        reqAlbum.IsVisible = false;

      album.EditAlbumSave([reqAlbum, reqAlbum.id], function (err, data) {
        if (!err)
          res.json({ type: 'success' });
        else
          res.json({ type: 'error' });
      });
    }
  } catch (e) {
    res.json({ type: 'error' });
  }
});

///УДАЛЕНИЕ
app.post('/RadioAdmin/Delete', auth, function (req, res) {
  try {
    if (req.body.id) {
      album.DeleteAlbum(req.body.id, function (err, data) {
        if (!err)
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
  try {
    album.GetLastWeekNumber(null, function (err, weekNumber) {
      album.GetAlbumsByWeekActive(weekNumber[0].Number, function (err, data) {
        if (!err) {
          data.map(function (e, i) {
            e.src = './TESTCovers/' + e.ImgName;
            e.title = e.BandName + ' -  «' + e.AlbumName + '» ';
            e.rate = 9;
          });

          res.render('Weeks.ejs', { items: data });
        }
      });
    });
  } catch (e) {
    res.render('Weeks.ejs', { items: null });
  }
});

///ПОЛУЧИМ НОМЕР НЕДЕЛИ
app.post('/weeks/getNumber', function (req, res) {
  try {
    album.GetLastWeekNumber(null, function (err, weekNumber) {
      if (!err)
          res.json({ type: 'success', number: weekNumber[0].Number.toString().substring(2) });
      else
        res.json({ type: 'error' });
    });
  } catch (e) {
    res.json({ type: 'error' });
  }
});

app.listen(10001, function () {
  console.log('Server successfully started on 10001 port');
});
