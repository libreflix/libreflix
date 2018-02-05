'use strict';

/**
 * Login required middleware
 */
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.redirect('/login');
	}
};

module.exports = ensureAuthenticated;