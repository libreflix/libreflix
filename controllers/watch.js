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
        req.flash('success', { msg: 'Muito obrigado por sua colaboração. Em breve a produção estará no ar. <3' });
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


//Get Edit Watch
exports.watchEdit = function(req, res){
  Watch.findOne({ '_id': req.params._id }, function(err, w){

    if (!w) {
      return res.redirect('/404');
    }
    else{
      res.render('edit', {
        w: w
      });
    }
  });
};



// PUT or Update a Production
exports.watchPut = function(req, res, next) {
var body = req.body;
  Watch.findById(req.params._id, function(err, watch) {
    /* Para salvar no BD */

    /* Internal */
    watch.permalink = req.body.permalink;
    watch.layout = req.body.layout;
    watch.featured  = req.body.featured;
    if (req.user.adm) {
      watch.criador = req.body.criador;      
      watch.top = req.body.top;
    }
    watch.mod_message = req.body.mod_message;
    watch.downloadable = req.body.downloadable;
    watch.canwecopy = req.body.canwecopy;

    /* Basic */
    watch.title = req.body.title;
    watch.subtitle = req.body.subtitle;
    watch.original_title = req.body.original_title;
    watch.year = req.body.year;
    watch.duration = req.body.duration;
    watch.classind = req.body.classind;
    watch.sinopse = req.body.sinopse;

    /* More Info */
    watch.description = req.body.description;
    watch.license = req.body.license;
    watch.location.country = req.body.location_country;
    watch.location.state = req.body.location_state;
    watch.location.city = req.body.location_city;
    // watch.location.lat = req.body.location.lat;
    // watch.location.lon = req.body.location.lon;
    watch.crew.director = req.body.crew_director;
    watch.crew.screenplay = req.body.crew_screenplay;
    watch.crew.producer = req.body.crew_producer;
    watch.crew.cast = req.body.crew_cast;
    watch.crew.editor = req.body.crew_editor;
    watch.crew.other = req.body.crew_other;

    /* Images */
    watch.imgbg = req.body.imgbg;
    watch.thumb480 = req.body.thumb480;
    watch.thumb130 = req.body.thumb130;

    /* Video */
    watch.video = req.body.video;
    watch.trailer = req.body.trailer;
    watch.quality = req.body.quality;
    watch.audio_language = req.body.audio_language;
    watch.srt_language = req.body.srt_language;

    /* Files and Download*/
    watch.file.film = req.body.file_film;
    watch.file.trailer = req.body.file_trailer;
    watch.file.srt = req.body.file_srt;

    /* Categories */
    watch.tags = req.body.tags;

    watch.save(function(err) {
      req.flash('success', { msg: 'Alterações feitas com sucesso.' });
      res.redirect('/edit/' + req.params._id);
    });

    });
};
