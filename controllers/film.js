'use strict';

import Watch from '../models/Watch';

/**
 * Get the Film info page
 */
exports.filmGet = function(req, res){
  var options = {
    film: []
  }

  Watch.findOne({ 'permalink': req.params.permalink }, function(err, film){
    if (!film) {
      return res.redirect('/404');
    }
		if (film) {
			options.film = film
      res.render('film', options);
		}
  }).populate('criador');

};
