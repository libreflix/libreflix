'use strict';

/** Get controllers */
const pagesController = require('../controllers/pages');
const authMiddleware = require('../middlewares/auth');

/**
 * Pages routes
 * Get informative pages
 *
 * @param {Router} - express router
 */
module.exports = function(router){
	/**
	 * Information about Libreflix
	 */
	router.route('/sobre')
		/** GET /sobre - Get information about Libreflix */
		.get(pagesController.sobreController);

	/**
	 * Information to download available apps
	 */
	router.route('/apps')
		/** GET /apps - Get information to download available apps */
		.get(pagesController.appsController);

	/**
	 * Information about Privacy Politics
	 */
	router.route('/privacy')
		/** GET /privacy - Get information about Privacy Politics */
		.get(pagesController.privacyController);

	/**
	 * Information about Terms
	 */
	router.route('/tos')
		/** GET /tos - Get information about Terms */
		.get(pagesController.tosController);

	/**
	 * Information about Digital Millennium Copyright Act (DMCA)
	 */
	router.route('/dmca')
		/** GET /dmca - Get information about Digital Millennium Copyright Act (DMCA) */
		.get(pagesController.dmcaController);

	/**
	 * Frequently asked questions
	 */
	router.route('/faq')
		/** GET /faq - Get frequently asked questions */
		.get(pagesController.faqController);

	/**
	 * Information for Press
	 */
	router.route('/press')
		/** GET /press - Get information for Press */
		.get(pagesController.pressController);

	/**
	 * Uploader of images
	 */
	router.route('/uploader')
		/** GET /uploader - Get the uploader of images */
		.get(authMiddleware, pagesController.uploaderController);

	return router;
}
