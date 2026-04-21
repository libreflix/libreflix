var nodemailer = require("nodemailer");

const { body, sanitize, validationResult } = require("express-validator");

var transporter = nodemailer.createTransport({
  service: "Mailgun",
  auth: {
    user: process.env.MAILGUN_USERNAME,
    pass: process.env.MAILGUN_PASSWORD,
  },
});

/**
 * GET /contact
 */
exports.contactGet = function (req, res) {
  res.render("contact", {
    title: "Contato",
  });
};

/**
 * POST /contact
 */
exports.contactPost = async function (req, res) {
  await body("title", "O campo título precisa ser preenchido.").run(req);
  await body("name", "Nome não pode estar em branco").run(req);
  await body("email", "O e-mail inserido não é valido").run(req);
  await body("email", "E-mail é obrigatório").run(req);
  await body("message", "A mensagem não pode estar em branco").run(req);
  await sanitize("email").normalizeEmail({ remove_dots: false }).run(req);

  var errors = !validationResult(req).isEmpty();

  if (errors) {
    req.flash("error", errors);
    return res.redirect("/contato");
  }

  var mailOptions = {
    from: req.body.name + " " + "<" + req.body.email + ">",
    to: "libreflix@protonmail.com",
    subject: "Formulário de Contato | Libreflix",
    text: req.body.message,
  };

  transporter.sendMail(mailOptions, function (err) {
    req.flash("success", { msg: "Obrigado! Sua mensagem foi enviada." });
    res.redirect("/contato");
  });
};
