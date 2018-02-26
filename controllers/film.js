'use strict';

var User = require('../models/User');
var Watch = require('../models/Watch');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');


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
