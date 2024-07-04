const mongoose = require('mongoose');

const schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
};

const refereceSchema = new mongoose.Schema({
    attachedToWatch: {type: mongoose.Schema.ObjectId, ref: 'Watch'},
    creator: {type: mongoose.Schema.ObjectId, ref: 'User'},
    url: String,
    title: String,
}, schemaOptions);

const Reference = mongoose.model('Reference', refereceSchema);

module.exports = Reference;
