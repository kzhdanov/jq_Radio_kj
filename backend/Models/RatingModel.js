module.exports = function(pool) {
	var context = {
		SaveRating: function(key, callback) {
			pool.query('INSERT INTO Ratings SET ?', key, callback);
		},
	};

	return context;
};
