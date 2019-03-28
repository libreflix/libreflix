'use strict';

/** Get controllers */
const filmController = require('../controllers/film');

/**
 * User Profile routes
 * You can see user profile
 *
 * @param {Router} - express router
 */
module.exports = function(router) {
  /**
   * User profile navigation
   * @param {string} permalink - A unique sequence of characters used to identify a user
   */
  router.route('/i/:permalink')
    /** GET /i/:permalink - Film info navigation */
    .get(filmController.filmGet);

  router.route('/i/:permalink')
    /** GET /i/:permalink - Film info navigation */
    .post(filmController.filmPost);

  router.route('/i/:permalink')
    /** GET /i/:permalink - Film info navigation */
    .get(filmController.filmGet);

  router.route('/i/:permalink/alreadyWatched')
    /** GET /i/:permalink - Film info navigation */
    .post(filmController.alreadyWatchedGet);

  router.route('/i/:permalink/favorite')
    /** GET /i/:permalink - Film info navigation */
    .post(filmController.favoriteGet);

  return router;
}
