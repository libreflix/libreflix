var User = require("../models/User");
let Watch = require("../models/Watch");
let Category = require("../models/Category");
var mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");

exports.listWatches = (req, res) => {
  Watch.find({}, null, { sort: "-id" }, function (err, watch) {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/list-watches", {
        title: "List watches",
        watch: watch,
      });
    }
  }).populate("criador");
};

exports.listCategoriesGet = (req, res) => {
  Category.find({}, null, { sort: "-id" }, function (err, categories) {
    if (err) {
      console.log(err);
    } else {
      res.render("admin/list-categories", {
        title: "List Categories",
        categories: categories,
      });
    }
  }).populate("criador");
};

/**
 * PUT /admin/list-categories
 * Add or update a new category.
 */
exports.listCategoriesPut = async function (req, res, next) {
  await body("title", "O campo título precisa ser preenchido.").run(req);
  await body("nid", "O campo nid precisa ser preenchido.").run(req);

  var errors = !validationResult(req).isEmpty();

  if (errors) {
    req.flash("error", errors);
    return res.redirect("/admin/list-categories");
  }

  Category.findOne({ nid: req.body.nid }, function (err, category) {
    if (category) {
      req.flash("error", {
        msg: "O Number Id inserido já existe. Tente outro.",
      });
      return res.redirect("/admin/list-categories");
    }
    // Para salvar no BD
    category = new Category({
      criador: req.user.id,
      nid: req.body.nid,
      format: req.body.format,
      preposition: req.body.preposition,
      title: req.body.title,
    });

    category.save(function (err) {
      //req.logIn(campanha, function(err) {
      req.flash("success", { msg: "Categoria inserida com sucesso." });
      res.redirect("/admin/list-categories");
      //});
    });
  });
};
