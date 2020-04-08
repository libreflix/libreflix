'use strict';

/** Get controllers */
const uploadController = require('../controllers/upload');
const authMiddleware = require('../middlewares/auth');

/**
 * Upload routes
 * You can upload images to the server
 *
 * @param {Router} - express router
 */
module.exports = function (router) {
	/**
	 * Upload images
	 */
	router.route('/upload')
		/** POST /upload - Upload images */
		.post(authMiddleware, uploadController.uploadImage);

	return router;
}
