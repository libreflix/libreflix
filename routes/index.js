'use strict';
const express = require('express');
const router = express.Router();

/**
 * Home Controller
 */
const HomeController = require('../controllers/home');

function init(app, passport) {
	/**
	 * Set up routes
	 */
	const contactRoutes = require('./contact')(router);
	const listRoutes = require('./list')(router);
	const pagesRoutes = require('./pages')(router);
	const profileRoutes = require('./profile')(router);
	const uploadRoutes = require('./upload')(router);
	const userRoutes = require('./user')(router, passport);
	const watchRoutes = require('./watch')(router);

	/**
	 * Mount routes
	 */

	/** GET / - Home */
	app.get('/', HomeController.index);

	app.use('/', contactRoutes);
	app.use('/', listRoutes);
	app.use('/', pagesRoutes);
	app.use('/', profileRoutes);
	app.use('/', uploadRoutes);
	app.use('/', userRoutes);
	app.use('/', watchRoutes);
}

module.exports = { init };
