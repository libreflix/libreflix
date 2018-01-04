var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var passport = require('passport');
var User = require('../models/User');

/**
 * Login required middleware
 */
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
};

/**
 * GET /login
 */
exports.loginGet = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Log in'
  });
};

/**
 * POST /login
 */
exports.loginPost = function(req, res, next) {
  req.assert('email', 'O e-mail inserido não é válido').isEmail();
  req.assert('email', 'O e-mail não pode ficar em branco').notEmpty();
  req.assert('password', 'A senha não pode ficar em branco').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/login');
  }

  passport.authenticate('local', function(err, user, info) {
    if (!user) {
      req.flash('error', info);
      return res.redirect('/login')
    }
    req.logIn(user, function(err) {
      res.redirect('/');
    });
  })(req, res, next);
};

/**
 * GET /logout
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
 * GET /signup
 */
exports.signupGet = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Criar conta'
  });
};

/**
 * POST /signup
 */
exports.signupPost = function(req, res, next) {
  req.assert('name', 'O nome não pode ficar em branco').notEmpty();
  req.assert('email', 'O e-mail inserido não é válido').isEmail();
  req.assert('email', 'O e-mail não pode ficar em branco').notEmpty();
  req.assert('password', 'A senha precisa ter pelo menos 4 caracteres').len(4);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/signup');
  }

  User.findOne({ email: req.body.email }, function(err, user) {
    	if (user) {
      	req.flash('error', { msg: 'O e-mail inserido já está associado com outra conta.' });
      	return res.redirect('/signup');
    	}
   	user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });
    user.save(function(err) {
      req.logIn(user, function(err) {
        res.redirect('/');
      });
    });
  });

};

/**
 * GET /account
 */
exports.accountGet = function(req, res) {
  res.render('account/profile', {
    title: 'Minha Conta'
  });
};

/**
 * PUT /account
 * Update profile information OR change password.
 */
exports.accountPut = function(req, res, next) {
  if ('password' in req.body) {
    req.assert('password', 'A senha precisa ter pelo menos 4 caracteres.').len(4);
    req.assert('confirm', 'As senhas inseridas não conferem.').equals(req.body.password);
  } else {
    req.assert('email', 'Este e-mail não é válido.').isEmail();
    req.assert('email', 'O campo "Email" precisa ser preenchido.').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });
  }

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function(err, user) {
    if ('password' in req.body) {
      user.password = req.body.password;
    } else {
      user.email = req.body.email;
      user.username = req.body.username;
      user.name = req.body.name;
      user.gender = req.body.gender;
      user.location = req.body.location;
      user.website = req.body.website;
    }
    user.save(function(err) {
      if ('password' in req.body) {
        req.flash('success', { msg: 'Sua senha foi redefinida com sucesso.' });
      } else if (err && err.code === 11000) {
        req.flash('error', { msg: 'E-mail ou username inseridos já estão associados com outra conta.' });
      } else {
        req.flash('success', { msg: 'Suas informações foram alteradas com sucesso.' });
      }
      res.redirect('/account');
    });
  });
};

/**
 * DELETE /account
 */
exports.accountDelete = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    req.logout();
    req.flash('info', { msg: 'Sua conta foi foi excluída com sucesso.' });
    res.redirect('/');
  });
};

/**
 * GET /unlink/:provider
 */
exports.unlink = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    switch (req.params.provider) {
      case 'facebook':
        user.facebook = undefined;
        break;
      case 'google':
        user.google = undefined;
        break;
      case 'twitter':
        user.twitter = undefined;
        break;
      case 'vk':
        user.vk = undefined;
        break;
      case 'github':
          user.github = undefined;
        break;
      default:
        req.flash('error', { msg: 'Invalid OAuth Provider' });
        return res.redirect('/account');
    }
    user.save(function(err) {
      req.flash('success', { msg: 'Your account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
 * GET /forgot
 */
exports.forgotGet = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 */
exports.forgotPost = function(req, res, next) {
  req.assert('email', 'O e-mail não é válido').isEmail();
  req.assert('email', ' e-mail não pode ficar em branco').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', { msg: 'O endereço de e-mail ' + req.body.email + ' não está associado com nenhuma conta.' });
          return res.redirect('/forgot');
        }
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // expire in 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'Libreflix@openmailbox.org',
        subject: 'Redefinir sua senha no Libreflix',
        text: 'Oi, tudo bem?\n\n Você está recebendo esse email porque pediu para redefenir a senha da sua conta no Libreflix.\n\n' +
        'Por favor, clique no link a seguir, ou cole no seu navegador para completar esse processo:\n\n' +
        'https://' + req.headers.host + '/reset/' + token + '\n\n' +
        'Se você não pediu essa redefinição, por favor ignore este e-mail e a sua senha não sofrerá nenhuma alteração.\n' +
        '\nAbraços Libres! <3\n\nTime Libreflix\n\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('info', { msg: 'Um e-mail foi enviado para ' + user.email + ' com mais informações.' });
        res.redirect('/forgot');
      });
    }
  ]);
};

/**
 * GET /reset
 */
exports.resetGet = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User.findOne({ passwordResetToken: req.params.token })
    .where('passwordResetExpires').gt(Date.now())
    .exec(function(err, user) {
      if (!user) {
        req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Redefinir Senha'
      });
    });
};

/**
 * POST /reset
 */
exports.resetPost = function(req, res, next) {
  req.assert('password', 'A senha precisa ter ao menos 4 caracteres').len(4);
  req.assert('confirm', 'A senhas não são iguais').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User.findOne({ passwordResetToken: req.params.token })
        .where('passwordResetExpires').gt(Date.now())
        .exec(function(err, user) {
          if (!user) {
            req.flash('error', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      var transporter = nodemailer.createTransport({
        service: 'Mailgun',
        auth: {
          user: process.env.MAILGUN_USERNAME,
          pass: process.env.MAILGUN_PASSWORD
        }
      });
      var mailOptions = {
        from: 'Libreflix@openmailbox.org',
        to: user.email,
        subject: 'Sua senha no Libreflix foi alterada',
        text: 'Olá! Tudo bem? \n\n' +
        'Este e-mail é uma confirmação que a senha da sua conta no Libreflix (' + user.email + ') foi alterada recentemente.\n\nAbraços Libres! <3\n\nTime Libreflix\n\n'
      };
      transporter.sendMail(mailOptions, function(err) {
        req.flash('success', { msg: 'Sua senha foi alterada com sucesso.' });
        res.redirect('/account');
      });
    }
  ]);
};
