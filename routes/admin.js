'use strict';

/** Get controllers */
const userController = require('../controllers/admin');
const authAdmin = require('../middlewares/auth-admin');

/**
 * Account routes
 * You can create, see, update and delete a user using email a social account (Facebook and Twitter are available now)
 *
 * @param {Router} - express router
 */
module.exports = function (router, passport) {

  router.route('/list-watches')
    /** Auth Middleware applied to all routes below */
    .all(authAdmin)
    .get(userController.listWatches);

}