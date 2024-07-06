const mongoose = require('mongoose');

const schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
};

const getTags = tags => tags.join(', ');
const setTags = tags => tags.split(', ');

/*
* This is the Festival schema.
*/

const festivalSchema = new mongoose.Schema({
    name:  String,
    logo: String,
    permalink: String,
    bannerImg: String,
    bannerImg_mobile: String,
    headerImg: String,
    footerImg: String,
    description: String,
    internalCategories: {type: []},

}, schemaOptions);


const Festival = mongoose.model('Festival', festivalSchema);

module.exports = Festival;
