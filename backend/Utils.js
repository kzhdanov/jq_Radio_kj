'use strict';
var defaultCash = {
  autor: 'no name',
  album: 'no name',
  songName: 'no name',
}

var Utils = {
  cash: Object.assign({}, defaultCash)
};

function BuildSongInfo(info) {
  return Utils.cash = {
    autor: info[0] === '' ? 'no name' : info[0],
    album: info[2] === '' ? 'no name' : info[2],
    songName: info[1] === '' ? 'no name' : info[1],
  };
}

function BuildArray() {
  return this.title.split(' ₽ ').map(function (item) { return item.trim(); });
}

Utils.TitleParcing = function () {
  try {
    var date = new Date();
    if (this.title) {
      return(BuildSongInfo(BuildArray.call(this)));
    }
    throw new Error("no song title: title exception time is " + date);
  } catch (e) {
    console.log(e);
    return null;
  }
}

module.exports = Utils;
