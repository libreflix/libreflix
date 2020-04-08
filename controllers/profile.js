'use strict';

var User = require('../models/User');
var Watch = require('../models/Watch');
var Interaction = require('../models/Interaction');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');


/**
 * Get the profile of someone
 */
exports.profileGet = function(req, res){

  User.findOne({ 'username': req.params.username }, function(err, profile){
    if(!profile){
      return res.redirect('/404');
    }
		if (profile) {
			  Interaction.find({'creator': profile.id}, null, {sort: '-updatedAt'}, function(err, interactions){
          res.render('profile', {
            interactions: interactions,
            profile: profile
          })
        }).populate('attachedToWatch')
      }
  })
}
