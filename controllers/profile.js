var User = require('../models/User');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');


// Get Movie or Series
exports.profileGet = function(req, res){
  User.findOne({ 'username': req.params.username }, function(err, p){

    if (!p) {
      return res.redirect('/404');
    }
    else{
      res.render('profile', {
        p: p
      });
    }
  });
};
