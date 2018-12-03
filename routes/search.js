'use strict';

/** Get controllers */
const searchController = require('../controllers/search');

/**
 * Search page routes
 *
 *
 * @param {Router} - express router
 */
module.exports = function (router) {
	/**
	 * Search Controller
	 * @param {string} busca - Search text to be done.
	 */
	router.route('/busca/:busca')
		/** GET /i/:search - Search page */
		.get(searchController.searchGet);

	return router;
}
