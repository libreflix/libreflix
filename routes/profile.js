'use strict';

/** Get controllers */
const profileController = require('../controllers/profile');

/**
 * User Profile routes
 * You can see user profile
 *
 * @param {Router} - express router
 */
module.exports = function (router) {
	/**
	 * User profile navigation
	 * @param {string} username - A unique sequence of characters used to identify a user
	 */
	router.route('/u/:username')
		/** GET /u/:username - User profile navigation */
		.get(profileController.profileGet);

	return router;
}
