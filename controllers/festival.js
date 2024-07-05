'use strict';

const Festival = require('../models/Festival');
const Watch = require('../models/Watch');
const Interaction = require('../models/Interaction');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Category = require("../models/Category");


/**
 * Get the profile of someone
 */
exports.festivalPageGet = function (req, res) {
    Festival.findOne({'permalink': req.params.permalink}, function (err, festival) {
        if (!festival) {
            return res.redirect('/404');
        }

        console.log(festival.internalCategories[0]);

        Category.find({'nid': festival.internalCategories[0]}, null, {sort: '-id'}, function (err, categories) {
            if (err) {
                console.log(err);
            } else {
                Watch.find({ categories: { $in: festival.internalCategories }}, null, {sort: '-id'}, function (err, w) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('festival/index', {
                            festival: festival,
                            categories: categories,
                            watch: w,
                        })
                    }
                });
            }
        });



    })
}
