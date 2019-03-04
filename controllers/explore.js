var Watch = require('../models/Watch');
var Category = require('../models/Category');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');


// GET Tags
exports.formatGet = function(req, res){
  Category.find({ 'format': req.params.format }, null, {sort: '-id'}, function(err, categories){
    if (err) {
      console.log(err);
    } else {
    Watch.find({ 'format': req.params.format }, null, {sort: '-id'}, function(err, w){
      if (err) {
        console.log(err);
      } else {
      res.render('explore', {
        format: req.params.format,
        categories: categories,
        watch: w
      });
    }
    });
  }
  });
};
