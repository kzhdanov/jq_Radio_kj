'use strict';
var Utils = {
  cash: {
    autor: 'no name',
    album: 'no name',
    songName: 'no name',
  },
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
};

Utils.HasChange = function(station) {
  try {
    var temp = BuildArray.call(station);
    if( Utils.cash.autor !== temp[0] ||  Utils.cash.album !== temp[2] || Utils.cash.songName !== temp[1] )
      return true;
    else
      return false;

  } catch (e) {
    return false;
  }
};

module.exports = Utils;
