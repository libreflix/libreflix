let Watch = require('../models/Watch');

/* Nunjucks custom filter */
var nunjucks = require('nunjucks');
var env = new nunjucks.Environment();

/**
 * GET /
 */


exports.index = function(req, res) {
  /*
  * Crazy code just to make a fresh look on the homepage everytime.
  * Very ugly solution, just temporary.
  */

  function random(low, high) {
    return Math.random() * (high - low) + low
  }

  random = random(0, 7)

  console.log(random);

  if (random > 0 && random < 1 ) {
    property = '-updatedAt'
  }
  if (random > 1 && random < 2 ) {
    property = 'updatedAt'
  }
  if (random > 2 && random < 3 ) {
    property = 'year'
  }
  if (random > 3 && random < 4 ) {
    property = '-year'
  }
  if (random > 4 && random < 5 ) {
    property = 'id'
  }
  if (random > 5 && random < 6 ) {
    property = '-id'
  }
  if (random > 6 && random < 7 ) {
    property = 'title'
  }
  if (random > 7 && random < 8 ) {
    property = '-title'
  }

  Watch.find({}, null, {sort: property}, function(err, watch){
    if(err){
      console.log(err);
    } else {
      res.render('inicio', {
        title:'Início',
        watch: watch,
      });
    }
  });
};
