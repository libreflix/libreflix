'use strict';

var User = require('../models/User');
var Watch = require('../models/Watch');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');


/**
 * Get the profile of someone
 */
exports.profileGet = function(req, res){
  var options = {
    profile: [],
    watch: []
  }

  User.findOne({ 'username': req.params.username }, function(err, p){
    if(!p){
      return res.redirect('/404');
    }
		if (p) {
			options.p = p
      Watch.find({'criador': options.p._id}, null, {sort: '-id'}, function(err, watch){

        if (watch) {
          options.watch = watch
        }
        else {
          options.watch = null
        }
        res.render('profile', options);
      }).limit();
		}
  });
};
