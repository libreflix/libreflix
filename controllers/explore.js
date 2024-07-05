var Watch = require('../models/Watch');
var Category = require('../models/Category');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');


// GET Film by format (docs, series, drama)
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
}

// GET film by category
exports.categoryGet = function (req, res) {
  Category.find({'nid': req.params.nid}, null, {sort: '-id'}, function (err, categories) {
    if (err) {
      console.log(err);
    } else {
      Watch.find({}, null, {sort: '-id'}, function (err, w) {
        if (err) {
          console.log(err);
        } else {
          res.render('explore', {
            format: 'category',
            categories: categories,
            watch: w,
          });
        }
      });
    }
  });
}

// GET film by original country
exports.countryGet = function(req, res){
  Category.find({}, null, {sort: '-id'}, function(err, categories){
    if (err) {
      console.log(err);
    } else {
    Watch.find({ 'location.country.code': req.params.code }, null, {sort: '-id'}, function(err, w){
      if (err) {
        console.log(err);
      } else {
      res.render('explore', {
        format: 'country',
        categories: categories,
        watch: w
      });
    }
    });
  }
  });
}

// GET film by duration
exports.durationGet = function(req, res){
  Category.find({}, null, {sort: '-id'}, function(err, categories){
    if (err) {
      console.log(err);
    } else {
    Watch.find({ 'duration': { $lte: Number(req.params.duration)} }, null, {sort: '-id'}).exec(function(err, w){
    // Watch.where('duration').lte(Number(req.params.duration)).sort('-id').exec(function(err, w){
      if (err) {
        console.log(err);
      } else {
      res.render('explore', {
        format: 'duration',
        duration: Number(req.params.duration),
        categories: categories,
        watch: w
      });
    }
    });
  }
  });
}
