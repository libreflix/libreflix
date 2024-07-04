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
    bannerImg: String,
    description: String,

}, schemaOptions);


const Festival = mongoose.model('Festival', festivalSchema);

module.exports = Festival;
