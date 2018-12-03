var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD
  }
});

/**
 * GET /contact
 */
exports.contactGet = function(req, res) {
  res.render('contact', {
    title: 'Contato'
  });
};

/**
 * POST /contact
 */
exports.contactPost = function(req, res) {
  req.assert('name', 'Nome não pode estar em branco').notEmpty();
  req.assert('email', 'O e-mail inserido não é valido').isEmail();
  req.assert('email', 'E-mail é obrigatório').notEmpty();
  req.assert('message', 'A mensagem não pode estar em branco').notEmpty();
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  var errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/contato');
  }

  var mailOptions = {
    from: req.body.name + ' ' + '<'+ req.body.email + '>',
    to: 'libreflix@protonmail.com',
    subject: 'Formulário de Contato | Libreflix',
    text: req.body.message
  };

  transporter.sendMail(mailOptions, function(err) {
    req.flash('success', { msg: 'Obrigado! Sua mensagem foi enviada.' });
    res.redirect('/contato');
  });
};
