module.exports = function(pool) {
	var context = {
		SaveRating: function(key, callback) {
			pool.query('INSERT INTO Ratings SET ?', key, callback);
		},
		GetRating: function(key, callback) {
			console.log(key);
			pool.query('SELECT rate FROM Ratings WHERE userTempId=? and album=? and autor=?', [key.user, key.album, key.group], callback);
		},
	};

	return context;
};
