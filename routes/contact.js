'use strict';
/** Get controllers */
const contactController = require('../controllers/contact');

/**
 * Contact routes
 * Available to get contact emails from users
 *
 * @param {Router} - express router
 */
module.exports = function (router) {
	/**
	 * Create a new contact email
	 */
	router.route('/contato')
		/** GET /contato - UI for contact email */
		.get(contactController.contactGet);

	/**
	 * Send contact email
	 */
	router.route('/contato')
		/** POST /contato - Send a contact email */
		.post(contactController.contactPost);

	return router;
}
