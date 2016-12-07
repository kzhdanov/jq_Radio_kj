module.exports = function(pool) {
	var context = {
		SaveRating: function(key, callback) {
			pool.query('INSERT INTO Ratings SET ?', key, callback);
		},
		GetRating: function(key, callback) {
			pool.query('SELECT rate as rate FROM Ratings WHERE userTempId=? and album=? and autor=?', [key.user, key.album, key.group], callback);
		},
		GetRatingMiddle: function (key, callback) {
			pool.query('SELECT rate as rate FROM Ratings WHERE album=? and autor=?', [key.album, key.autor], callback);
		},
		//SELECT rate FROM `Ratings` WHERE album = 'Death Of A Bachelor' && autor = 'Panic! At The Disco'
		//SELECT count(*) FROM `Ratings` WHERE album = 'Death Of A Bachelor' && autor = 'Panic! At The Disco'
	};

	return context;
};
