'use strict';

const festivalController = require('../controllers/festival');

/**
 * Festival routes
 * You can see user profile
 *
 * @param {Router} - express router
 */
module.exports = function (router) {
	/**
	 * User profile navigation
	 * @param {string} festivalName - A unique sequence of characters used to identify a festival
	 */
	router.route('/f/:permalink').get(festivalController.festivalPageGet);

	return router;
}
