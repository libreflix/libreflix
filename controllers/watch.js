const async = require('async');
const Watch = require('../models/Watch');
const Category = require('../models/Category');
const Reference = require('../models/Reference');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { buildPermalink } = require('../utils/form-util');


// Get Movie or Series
exports.watchGet = function (req, res) {
    Watch.findOne({'permalink': req.params.permalink}, function (err, w) {

        if (req.params.ep_number) {
            ep_number = req.params.ep_number - 1;
        } else {
            ep_number = 0;
        }

        let isMobile = false,
            isDesktop = false;

        // to test if desktop
        if (req.device.type == 'phone') {
            isMobile = true
        } else if (req.device.type == 'desktop' && w.layout != "serie") {
            // var isDesktop = true
            isMobile = true
        } else {
            isMobile = true
        }


        if (typeof req.headers.referer !== 'undefined') {
            if ((req.headers.referer.match(/^https?:\/\/([^\/]+\.)?libreflix\.org(\/|$)/i)) ||
                (req.headers.referer.match(/^https?:\/\/([^\/]+\.)?localhost:3998(\/|$)/i))) {

            } else {
                return res.redirect('/i/' + w.permalink);
            }
        } else {
            return res.redirect('/i/' + w.permalink);
        }

        if (w.useWatchV2) {
            res.render('watchv2', {
                title: w.title,
                isMobile: isMobile,
                isDesktop: isDesktop,
                w_eps: w.eps[ep_number],
                next_episode: ep_number + 2,
                w: w
            })
        } else {
            res.render('watch', {
                w: w,
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
            })
        }
    });
};

// GET New Production
exports.newWatchGet = function (req, res) {
    if (!req.user) {
        return res.redirect('/login');
    }
    res.render('novo', {
        title: 'Criar Nova Produção'
    });
};

// POST New Production
exports.newWatchPost = function (req, res, next) {
    let body = req.body;
    let form = {}; // para retornar depois do erro
    let errors = req.validationErrors();

    if (errors) {
        req.flash('error', errors);
        return res.render('novo', {form: form});
    }

    let permalink  = buildPermalink(req.body.title, req.body.year);

    Watch.findOne({permalink: permalink}, function (err, watch) {
        if (watch) {
            req.flash('error', {msg: 'O permalink inserido já existe. Tente outro.'});
            return res.redirect('/novo');
        }
        // Para salvar no BD
        watch = new Watch({
            criador: req.user.id,
            permalink: permalink,
            layout: 'filme',
            featured: false,
            title: req.body.title,
            subtitle: req.body.subtitle,
            sinopse: req.body.sinopse,
            year: req.body.year,
            classind: req.body.classind,
            duration: req.body.duration,
            video: req.body.video,
            thumb480: req.body.thumb480,
            imgbg: req.body.imgbg,
            tags: req.body.tags,
            status: "pending"
        });
        watch.save(function (err) {
            req.flash('success', {msg: 'Muito obrigado por sua colaboração. Em breve a produção estará no ar. <3'});
            res.redirect(`/i/${permalink}`);
        });
    });

};


// GET Tags
exports.tagsGet = function (req, res) {
    Watch.find({'tags': req.params.tags}, null, {sort: '-year'}, function (err, w) {

        if (!w) {
            return res.redirect('/404');
        } else {
            res.render('home', {
                title: 'Tag',
                tag: req.params.tags,
                watch: w
            });
        }
    });
};


//Get Edit Watch
exports.watchEdit = function (req, res) {
    Category.find({}, null, {sort: 'title'}, function (err, categories) {
        Watch.findOne({'_id': req.params._id}, function (err, w) {
            Reference.find({'attachedToWatch': req.params._id}, function (err, reference) {

                if (!w) {
                    return res.redirect('/404');
                } else {
                    res.render('edit', {
                        categories: categories,
                        reference: reference,
                        w: w
                    });
                }
            });
        }).populate('modComments.moderator').populate('criador');
    });
};


// PUT or Update a Production
exports.watchPut = function (req, res, next) {
    var body = req.body;
    Watch.findById(req.params._id, function (err, watch) {
        /* Para salvar no BD */

        /* Internal */
        watch.permalink = req.body.permalink;
        watch.layout = req.body.layout;
        watch.featured = req.body.featured;
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
        watch.location.country.code = req.body.location_country.code;
        watch.location.country.code = req.body.location_country.split("|")[0];
        watch.location.country.name = req.body.location_country.split("|")[1];
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

        watch.subs.pt_br = req.body.subs_pt;
        watch.subs.es = req.body.subs_es;
        watch.subs.en = req.body.subs_en;

        /* Categories */
        watch.tags = req.body.tags;
        watch.format = req.body.format;
        watch.categories = req.body['categories[]'];

        /* External Links */
        watch.links.website = req.body.website;
        console.log(req.body.website);
        console.log(watch.links.website);

        watch.links.wikipedia = req.body.wikipedia;
        watch.links.twitter = req.body.twitter;
        watch.links.imdb = req.body.imdb;
        watch.links.filmow = req.body.filmow;
        watch.links.facebook = req.body.facebook;
        watch.links.instagram = req.body.instagram;


        /* ModComments */
        watch.modComments.moderator = req.user.id;
        if (req.user.mod === true || req.user.adm === true) {
            watch.modComments.status = req.body.modComments_status;
            watch.status = req.body.modComments_status;
        }
        watch.modComments.comment = req.body.modComments_comment;

        if (req.body.modComments_status_old !== req.body.modComments_status) {
            async.waterfall([
                function () {
                    var transporter = nodemailer.createTransport({
                        service: 'Mailgun',
                        auth: {
                            user: process.env.MAILGUN_USERNAME,
                            pass: process.env.MAILGUN_PASSWORD
                        }
                    });
                    var mailOptions = {
                        to: req.body.criador_email,
                        from: 'libreflix@protonmail.com',
                        subject: 'Alteração de status de obra no Libreflix',
                        html: 'Olá, amigx criador!' +
                            '<br>O status da sua obra <b>' + req.body.title + '</b> foi alterado no Libreflix.' +
                            '<br><br>Status anterior: ' + req.body.modComments_status_old +
                            '<br>Status atual: ' + req.body.modComments_status +
                            '<br><br>Comentário de um Librerian:<br> <pre>' + req.body.modComments_comment + '</pre>' +
                            '<br><br>Muito obrigado por criar o Libreflix junto com a gente.' +
                            '<br><br>Abraços Libres! <3<br>Time Libreflix<br><a href="https://libreflix.org"><img src="https://libreflix.org/libreflix.png" width="100"></a>'
                    };
                    transporter.sendMail(mailOptions, function (err) {
                    });
                }
            ]);
        }
        watch.save(function (err) {
            req.flash('success', {msg: 'Alterações feitas com sucesso.'});
            res.redirect('/edit/' + req.params._id);
        });


    });
};

exports.newReference = function (req, res, next) {

    if (req.xhr || req.accepts('json,html') === 'json') {
        console.log('OI');
        console.log(req.body.u);
        console.log(req.body.ref_url);
        console.log(req.body.ref_title);

        if (req.body.ref_url && req.body.ref_title) {
            Watch.findOne({'permalink': req.params.permalink}, function (err, watch) {

                reference = new Reference({
                    attachedToWatch: watch.id,
                    creator: req.body.u,
                    url: req.body.ref_url,
                    title: req.body.ref_title
                });
                reference.save(function (err) {
                    res.send({success: true})
                });
            })
        } else {
            res.send({success: false})
        }


    }
}
