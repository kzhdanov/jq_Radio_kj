module.exports = function(pool) {
	var context = {
		SaveAlbum: function(key, callback) {
			pool.query('INSERT INTO Albums SET ?', key, callback);
		},
		GetAlbumsByWeek: function(key, callback) {
			pool.query('SELECT * FROM Albums where WeekNumber=? order by dateCreate desc', key, callback);
		},
	};

	return context;
};
