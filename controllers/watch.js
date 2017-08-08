var Watch = require('../models/Watch');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');


// Get Movie or Series
exports.watchGet = function(req, res){
  Watch.findOne({ 'permalink': req.params.permalink }, function(err, w){

    if (!w) {
      return res.redirect('/404');
    }
    else{
      res.render('watch', {
        title: w.title,
        layout: w.layout,
        subtitle: w.subtitle,
        sinopse: w.sinopse,
        year: w.year,
        imgbg: w.imgbg,
        video: w.video,
        thumb480: w.thumb480,
        thumb130: w.thumb130,
        runtime: w.runtime,
        eps: w.eps
      });
    }
  });
};


// GET New Production

exports.newWatchGet = function(req, res) {
  if (!req.user) {
    return res.redirect('/login');
  }
  res.render('novo', {
    title: 'Criar Nova Produção'
  });
};

// POST New Production
exports.newWatchPost = function(req, res, next) {


var body = req.body;

  // para retornar depois do erro
  var form = {
  };

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.render('novo', {form: form});
  }

  Watch.findOne({ permalink: req.body.permalink }, function(err, watch) {
    	if (watch) {
      	req.flash('error', { msg: 'O permalink inserido já existe. Tente outro.' });
      	return res.redirect('/novo');
    	}
      // Para salvar no BD
   	watch = new Watch({
      criador: req.user.id,
      permalink: req.body.permalink,
      layout: 'filme',
      featured : false,
      title: req.body.title,
      subtitle: req.body.subtitle,
      sinopse: req.body.sinopse,
      year: req.body.year,
      classind: req.body.classind,
      duration: req.body.duration,
      video: req.body.video,
      thumb480: req.body.thumb480,
      imgbg: req.body.imgbg,
      tags: req.body.tags
    });
    watch.save(function(err) {
      //req.logIn(campanha, function(err) {
        res.redirect('/');
      //});
    });
  });

};


// GET Tags
exports.tagsGet = function(req, res){
  Watch.find({ 'tags': req.params.tags }, null, {sort: '-year'}, function(err, w){

    if (!w) {
      return res.redirect('/404');
    }
    else{
      res.render('home', {
        title: 'Tag',
        tag: req.params.tags,
        watch: w
      });
    }
  });
};
