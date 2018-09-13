'use strict';

/**
 * Login required middleware
 */
function isAuthenticatedAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    // Verifica se o usuário é admin, se não joga pro not-found
    if (req.user.adm) {
      next();
    }
    else if (req.user.mod) {
      next();
    }

  } else {
    res.redirect('/no-permission');
  }
};

module.exports = isAuthenticatedAdmin;
