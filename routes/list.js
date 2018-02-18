'use strict';

/** Get controllers */
const listController = require('../controllers/list');

/**
 * List routes
 * You can see a list pendient
 *  
 * @param {Router} - express router
 */
module.exports = function (router) {
	/**
	 * List pending productions
	 */
	router.route('/list')
		/** GET /list - Get a list of pending productions */
		.get(listController.index);

	return router;
}
