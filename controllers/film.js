'use strict';

var User = require('../models/User');
var Watch = require('../models/Watch');
var Comment = require('../models/Comment');
var Category = require('../models/Category');
var Interaction = require('../models/Interaction');
var Reference = require('../models/Reference');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');


/**
 * Get the Film info page
 */
exports.filmGet = function(req, res){

  Watch.findOne({ 'permalink': req.params.permalink }, function(err, film){
    if (!film) {
      return res.redirect('/404');
    }
    if (req.user) {
      var phash = req.user.id + film.id
    } else {
      var phash = '_' + film.id
    }

		if (film) {
      Category.find({}, function(err, categories ){
      Comment.find({ 'attachedToWatch': film.id }, function(err, comments){
      Interaction.find({ 'attachedToWatch': film.id }, function(err, all_rating) {
      Interaction.findOne({ proofhash: phash }, function(err, interaction) {
      Reference.find({ 'attachedToWatch': film.id }, function(err, reference) {
      res.render('film', {
        film: film,
        comments: comments,
        categories: categories,
        interaction: interaction,
        all_rating: all_rating,
        reference: reference,
      });
    })
    })
  })
  }).populate('creator');
    })
		}
  }).populate('criador');

};

/**
 * Post the Film info page
 */
exports.filmPost = function(req, res, next) {

  // Test if there is no commentary, so it is a rating post, so rating can not be zero
  if (!req.body.comment_body && req.body.stars == 0) {
    req.assert('stars', 'Sua avaliação não pode ficar em branco').notEmpty();
  }

  // para retornar depois do erro
  var form = {
  };

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect(req.get('referer'));
  }

  Watch.findOne({ permalink: req.params.permalink }, function(err, watch) {
    if (req.user) {
      var phash = req.user.id + watch.id
    } else {
      var phash = '_' + watch.id
    }
    Interaction.findOne({ proofhash: phash }, function(err, interaction) {
      // If it is only a comment
      if (req.body.comment_body) {
        // Para salvar no BD
       	var comment = new Comment({
          attachedToWatch: watch.id,
          creator: req.user.id,
          date: Date.now(),
          type:'public',
          body: req.body.comment_body
        });
        if (req.body.comment_body.trim() != "" || req.body.stars > 0) {
          comment.save(function(err) {
            //req.logIn(campanha, function(err) {
              req.flash('success', { msg: 'Seu comentário e/ou avaliação foram postados com sucesso.' });
              res.redirect(req.get('referer'));
            //});
          });
        } else {
          req.flash('error', { msg: 'Seu comentário e/ou avaliação estão vazios.' });
          res.redirect(req.get('referer'));
        }
      }
      // if is a star rating
      else if (req.body.stars) {

        // Para salvar no BD
        if (interaction) {
          // so we need to update
          interaction.stars = req.body.stars;
          interaction.alreadyWatched = true;
          interaction.save(function(err) {
            //req.logIn(campanha, function(err) {
              req.flash('success', { msg: 'Sua avaliação foi atualizada com sucesso.' });
              res.redirect(req.get('referer'));
            //});
          });

        } else {
         	interaction = new Interaction({
            attachedToWatch: watch.id,
            creator: req.user.id,
            proofhash: phash,
            alreadyWatched: true,
            favorite: false,
            stars: req.body.stars,
            date: Date.now()
          });
          interaction.save(function(err) {
            //req.logIn(campanha, function(err) {
              req.flash('success', { msg: 'Sua avaliação foi postada com sucesso.' });
              res.redirect(req.get('referer'));
            //});
          });

        }
      }
  });
})
};

exports.favoriteGet = function(req, res, next) {

  if (req.xhr || req.accepts('json,html') === 'json') {
    console.log('OI');
    console.log(req.body.u);

    Watch.findOne({ 'permalink': req.params.permalink }, function(err, watch){

      var phash = req.user.id + watch.id

      Interaction.findOne({'proofhash': phash}, function(err, interaction){
        // If there is a interaction...
        // Para salvar no BD
        if (interaction) {
          // so we need to update
          if (interaction.favorite) {
            interaction.favorite = false;
          }
          else {
            interaction.favorite = true;
          }
          interaction.save(function(err) {
              res.send({success: true})
          });
        } else {
          var phash = req.body.u + watch.id
         	interaction = new Interaction({
            attachedToWatch: watch.id,
            alreadyWatched: false,
            favorite: true,
            stars: 0,
            creator: req.body.u,
            proofhash: phash,
            date: Date.now()
          });
          interaction.save(function(err) {
              res.send({success: true})
          });

        }
      })
    })
  }

}

exports.alreadyWatchedGet = function(req, res, next) {

  if (req.xhr || req.accepts('json,html') === 'json') {
    console.log('OI');
    console.log(req.body.u);



    Watch.findOne({ 'permalink': req.params.permalink }, function(err, watch){

      var phash = req.user.id + watch.id

      Interaction.findOne({'proofhash': phash}, function(err, interaction){
        // If there is a interaction...
        // Para salvar no BD
        if (interaction) {
          // so we need to update
          if (interaction.alreadyWatched) {
            interaction.alreadyWatched = false;
            interaction.stars = 0;
          }
          else {
            interaction.alreadyWatched = true;
          }
          interaction.save(function(err) {
              res.send({success: true})
          });
        } else {
          var phash = req.body.u + watch.id
         	interaction = new Interaction({
            attachedToWatch: watch.id,
            alreadyWatched: true,
            favorite: false,
            stars: 0,
            creator: req.body.u,
            proofhash: phash,
            date: Date.now()
          });
          interaction.save(function(err) {
              res.send({success: true})
          });

        }
      })
    })
  }
}
exports.newTags = function(req, res, next) {

  if (req.xhr || req.accepts('json,html') === 'json') {

    Watch.findOne({ 'permalink': req.params.permalink }, function(err, watch){
        // If there is a interaction...
        // Para salvar no BD
        if (watch) {
          // so we need to update
          var phash = watch.tags + ',' + req.body.newtagsinput

          // If bad use of the tags recommendation, we can change tags to usertags
          watch.tags = phash

          watch.save(function(err) {
              res.send({success: true})
          });
        }
    })
  }
}

exports.downloadGet = function(req, res) {
  Watch.findOne({'permalink': req.params.permalink}, function(err, film) {
    res.render('download', {
      film: film
    })
  })
}

/**
 * DELETE a comment
 */
exports.commentDelete = function(req, res, next) {
  Comment.findOne({ _id: req.body.del }, function(err, comment){
    if(comment.creator == req.user.id || req.user.adm ){
      Comment.remove({ _id: req.body.del }, function(err) {
        req.flash('info', { msg: 'O comentário foi excluída com sucesso.' });
        res.redirect(req.originalUrl.replace("?_method=DELETE","") + "#comments");
      })
    }
  })
};
