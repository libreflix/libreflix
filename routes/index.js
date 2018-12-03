'use strict';
const express = require('express');
const router = express.Router();
const notFoundMiddleware = require('../middlewares/not-found');

/**
 * Home Controller
 */
const HomeController = require('../controllers/home');

function init(app, passport) {
	/**
	 * Set up routes
	 */
	const contactRoutes = require('./contact')(router);
	const searchRoutes = require('./search')(router);
	const listRoutes = require('./list')(router);
	const pagesRoutes = require('./pages')(router);
	const profileRoutes = require('./profile')(router);
	const uploadRoutes = require('./upload')(router);
	const userRoutes = require('./user')(router, passport);
	const watchRoutes = require('./watch')(router);
	const filmRoutes = require('./film')(router);
  const adminRoutes = require('./admin')(router, passport);

	/**
	 * Mount routes
	 */

	/** GET / - Home */
	app.get('/', HomeController.index);

	app.use('/', contactRoutes);
	app.use('/', searchRoutes);
	app.use('/', listRoutes);
	app.use('/', pagesRoutes);
	app.use('/', profileRoutes);
	app.use('/', uploadRoutes);
	app.use('/', userRoutes);
	app.use('/', watchRoutes);
	app.use('/', filmRoutes);

	/**
	 * Error handling middleware
	 */
	app.use(notFoundMiddleware);
}

module.exports = { init };
