let Watch = require('../models/Watch');

/* Nunjucks custom filter */
var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();

/**
 * GET /
 */

exports.index = function(req, res) {
  Watch.find({}, null, {sort: '-_id'}, function(err, watch){
    if(err){
      console.log(err);
    } else {
      res.render('inicio', {
        title:'Início',
        watch: watch
      });
    }
  });
};
