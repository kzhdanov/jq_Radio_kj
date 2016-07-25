'use strict';
var Utils = {};

Utils.songInfo = {
  autor: 'no name',
  album: 'no name',
  songName: 'no name',
};

function BuildSongInfo(info) {
  return Utils.songInfo = {
    autor: info[0] === '' ? 'no name' : info[0],
    album: info[2] === '' ? 'no name' : info[2],
    songName: info[1] === '' ? 'no name' : info[1],
  };
}

Utils.TitleParcing = function () {
  try {
    var date = new Date();
    if (this.title) {
      console.log(this,title);
      return(BuildSongInfo(this.title.split(' ₽ ').map(function (item) { return item.trim(); })))
    }
    throw new Error("no song title: title exception time is " + date);
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = Utils;
