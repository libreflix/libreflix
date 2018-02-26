'use strict';

/** Get controllers */
const filmController = require('../controllers/film');

/**
 * User Profile routes
 * You can see user profile
 *
 * @param {Router} - express router
 */
module.exports = function (router) {
	/**
	 * User profile navigation
	 * @param {string} permalink - A unique sequence of characters used to identify a user
	 */
	router.route('/i/:permalink')
		/** GET /i/:permalink - Film info navigation */
		.get(filmController.filmGet);

	return router;
}
