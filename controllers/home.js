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


Promise.all([
  Watch.find({ $and : [{'featured': true}, {'top': 'hot'}]}, null, {sort: property}).limit(4),
  Watch.find({ $and : [{'featured': true}, {'tags': 'diadotrabalhador'}]}, null, {sort: property}).limit(4),
  Watch.find({ $and : [{'featured': true}, {'tags': 'ditadura'}]}, null, {sort: property}).limit(4*2),
  Watch.find({ $and : [{'featured': true}, {'top': 'new-l'}]}, null, {sort: property}).limit(4*4),
  Watch.find({'featured': true}, null, {sort: '-createdAt'}).limit(8),
  Watch.find({ $and : [{'featured': true}, {'top': 'top-l'}]}, null, {sort: property}).limit(4*4),
  Watch.find({ $and : [{'featured': true}, {'top': 'top-c'}]}, null, {sort: property}).limit(4*4),
  Watch.find({ $and : [{'featured': true}, {'top': 'top-s'}]}, null, {sort: property}).limit(4*4),
  Watch.find({ $and : [{'featured': true}, {'top': 'new-c'}]}, null, {sort: property}).limit(4*3)
]).then(([
  hot, diadotrabalhador, ditadura, new_l, fresh_all, top_l, top_c, top_s, new_c
]
) => {
  let options = {
    title: "Início",
    diadotrabalhador: diadotrabalhador,
    new_l: new_l,
    todaypick: todaypick,
    hot: hot,
    fresh_all: fresh_all,
    top_l: top_l,
    top_c: top_c,
    top_s: top_s,
    new_c: new_c
  }
  res.render('inicio', options);
})

};
