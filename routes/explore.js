'use strict';

/** Get controllers */
const exploreController = require('../controllers/explore');

/**
 * Watch routes
 * You can watch productions and filtered productions by tag.
 * Also, add and update productions.
 *
 * @param {Router} - express router
 */
module.exports = function (router) {
	/*
	* Get a productions from from that format to watch
	* @param {string} format - Is the format of the prodction (doc, fic or series)
	*/
	router.route('/explore/format/:format')
	/** GET /assistir/:format - Get porductions from that format */
	.get(exploreController.formatGet);

	/*
	* Get a productions from that category number id
	* @param {string} nid - Is the number id of a category
	// */
	router.route('/explore/category/:nid')
	/** GET /category/:nid - Get productions from that category */
	.get(exploreController.categoryGet);


	/*
	 * Get porductions from that country
	 * @param {string} code - Is the ISO code of that country.
	 */
	router.route('/explore/country/:code')
		/** GET /country/:code - Get porductions from that country */
		.get(exploreController.countryGet);

	/*
	 * Get porductions from a limit time duration
	 * @param {string} time - Is the limit of time in seconds
	 */
	router.route('/explore/duration/:duration')
		/** GET /duration/:duration - Get porductions from that duration limit (equal and below) */
		.get(exploreController.durationGet);



	return router;
}
