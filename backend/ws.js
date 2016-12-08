//WEB SOCKET
'use strict';
let WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({ port: 8089 }),
    internetradio = require('node-internet-radio'),
    resultCash, intervalId = null, timer = 5000,
    radioLink = 'http://eu3.radioboss.fm:8022/live',
    utils = require('./Utils');

let defaultCash = {
  autor: 'no name',
  album: 'no name',
  songName: 'no name',
};

let WSFunc = {
  WsInterval: (internetradio, radioLink, resolve) => {
    internetradio.getStationInfo(radioLink, (error, station) => {
      if (!error) {
        let result = utils.TitleParcing.call(station);

        if( !result )
          result = defaultCash;

        if (defaultCash.autor != result.autor ||
            defaultCash.songName != result.songName
            || defaultCash.album != result.album) {

          defaultCash.autor = result.autor;
          defaultCash.songName = result.songName;
          defaultCash.album = result.album;

          resolve(defaultCash);
        } else {
          resolve(null);
        }
      } else {
        console.log({ type: 'error', msg: error });
      }
    });
  },

  Interval: () => {
    intervalId =
    setInterval(() => {
      let promise = new Promise((resolve, reject) => {
        WSFunc.WsInterval(internetradio, radioLink, resolve);
      });

      promise.then(
        result => {
          if (result) {
            resultCash = result;

            wss.clients.forEach(function each(client) {
              client.send(JSON.stringify(resultCash));
            });
          }

          //console.log(result);
        },

        error => console.log('Rejected: ' + error.message)
      );
    }, timer);
  },

  Start: () => {
    WSFunc.Interval();
    wss.on('connection', function (ws) {
      if (!intervalId)
        Interval();
      else {
        wss.clients.forEach(function each(client) {
          client.send(JSON.stringify(resultCash));
        });
      }
    });
  },

};

module.exports = WSFunc;
