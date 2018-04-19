'use strict';

/** Get controllers */
const userController = require('../controllers/user');
const authMiddleware = require('../middlewares/auth');

/**
 * Account routes
 * You can create, see, update and delete a user using email a social account (Facebook and Twitter are available now)
 *
 * @param {Router} - express router
 */
module.exports = function (router, passport) {
	/**
	 * Account management
	 */
	router.route('/account')
		/** Auth Middleware applied to all routes below */
		.all(authMiddleware)
		/** GET /account - Get an account profile */
		.get(userController.accountGet)
		/** PUT /account - Update an account */
		.put(userController.accountPut)
		/** DELETE /account - Delete an account */
		.delete(userController.accountDelete);

    /**
	 * Sign up to create a new account
	 */
	router.route('/signup')
		/** GET /signup - UI to create a new account */
		.get(userController.signupGet)
		/** POST /signup - Create a new account */
		.post(userController.signupPost);

	/**
	 * Login page
	 */
	router.route('/login')
		/** GET /login - login's UI */
		.get(userController.loginGet)
		/** POST /login - Login into an account */
		.post(userController.loginPost);

	/**
	 * User's password recovery
	 */
	router.route('/forgot')
		/** GET /forgot - UI to recover user's password */
		.get(userController.forgotGet)
		/** POST /forgot - recover user's password */
		.post(userController.forgotPost);

	/**
	 * Reset forgoted user's password
	 * @param {string} token - Token validation
	 */
	router.route('/reset/:token')
		/** GET /reset:token - UI to reset user's password */
		.get(userController.resetGet)
		/** POST /reset:token - reset forgoted user's password */
		.post(userController.resetPost);

	/**
	 * Logout
	 */
	router.route('/logout')
		/** GET /logout - Logout user **/
		.get(userController.logout);

	/**
	 * Disconnect user's social media provider
	 * @param {string} provider - social media provider (Facebook and Twitter are available now)
	 */
	router.route('/unlink/:provider')
		/** GET /unlink/:provider - Disconnect user's social media account */
		.get(authMiddleware, userController.unlink);

	/**
	 * Authentication using Facebook
	 */
	router.route('/auth/facebook')
		/** GET /auth/facebook - Authentication using Facebook */
		.get(passport.authenticate('facebook', { scope: ['email', 'user_location'] }));

	/**
	 * Authentication callback using Facebook
	 */
	router.route('/auth/facebook/callback')
		/** GET /auth/facebook/callback - Authentication callback using Facebook */
		.get(passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' }));

	/**
	 * Authentication using Twitter
	 */
	router.route('/auth/twitter')
		/** GET /auth/twitter - Authentication using Twitter */
		.get(passport.authenticate('twitter'));

	/**
	 * Authentication callback using Twitter
	 */
	router.route('/auth/twitter/callback')
		/** GET /auth/twitter/callback - Authentication callback using Twitter */
		.get(passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

	/**
	 * Authentication using Github - Not available rigth now
	 */
	router.route('/auth/github')
		/** GET /auth/github - Authentication using Github */
		.get(passport.authenticate('github', { scope: [ 'user:email profile repo' ] }));

	/**
	 * Authentication callback using Github - Not available rigth now
	 */
	router.route('/auth/github/callback')
		/** GET /auth/github/callback - Authentication callback using Github */
		.get(passport.authenticate('github', { successRedirect: '/', failureRedirect: '/login' }));

	return router;
}
