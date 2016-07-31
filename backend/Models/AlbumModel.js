module.exports = function(pool) {
	var context = {
		SaveAlbum: function(key, callback) {
			pool.query('INSERT INTO Albums SET ?', key, callback);
		},
		GetAlbumsByWeek: function(key, callback) {
			pool.query('SELECT * FROM Albums WHERE WeekNumber=? order by dateCreate desc', key, callback);
		},
		GetAlbumById: function(key, callback) {
			pool.query('SELECT * FROM Albums WHERE id=?', key, callback);
		},
		EditAlbumSave: function(key, callback) {
			pool.query('UPDATE Albums SET ? WHERE id=?', key, callback);
		},
		DeleteAlbum: function (key, callback) {
			pool.query('DELETE FROM Albums WHERE id=?', key, callback);
		},
	};

	return context;
};
