'use strict';

/** Get controllers */
const watchController = require('../controllers/watch');
const authMiddleware = require('../middlewares/auth');

/**
 * Watch routes
 * You can watch productions and filtered productions by tag.
 * Also, add and update productions.
 *
 * @param {Router} - express router
 */
module.exports = function(router) {
  /*
   * Get a production to watch
   * @param {string} permalink - Is the link to a individual production
   */
  router.route('/assistir/:permalink')
    /** GET /assistir/:permalink - Get a production to watch */
    .get(watchController.watchGet);

  router.route('/assistir/:permalink/ep/:ep_number')
    /** GET /assistir/:permalink/ep/:ep_number - Get a episode number of a series */
    .get(watchController.watchGet);

  /*
   * Create a new production
   */
  router.route('/novo')
    /** GET /novo - UI for new production */
    .get(authMiddleware, watchController.newWatchGet)
    /** POST /novo - Create new production */
    .post(authMiddleware, watchController.newWatchPost);

  /**
   * Update a production
   * @param {string} - Is the identifier of the production
   */
  router.route('/edit/:_id')
    /** GET /edit/:id - Update watch */
    .get(authMiddleware, watchController.watchEdit)

    /** GET /edit/:id - Update watch */
    .post(authMiddleware, watchController.watchPut);

  /**
   * Filter productions by specified tag
   */
  router.route('/t/:tags')
    /** GET /t/:tags - Get filtered productions by specified tags */
    .get(watchController.tagsGet);

  router.route('/edit/:permalink/newreference')
    /** GET /i/:permalink - Film info navigation */
    .post(watchController.newReference);

  return router;
}
