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
	/** GET /assistir/:format - Get porductions from that country */
	.get(exploreController.formatGet);

	/*
	* Get a productions from that category number id
	* @param {string} nid - Is the number id of a category
	// */
	// router.route('/explore/category/:nid')
	// /** GET /assistir/:nid - Get porductions from that country */
	// .get(exploreController.categoryGet);
	//
	// /*
	//  * Get porductions from that country
	//  * @param {string} code - Is the ISO code of that country.
	//  */
	// router.route('/explore/country/:code')
	// 	/** GET /assistir/:code - Get porductions from that country */
	// 	.get(exploreController.countryGet);



	return router;
}
