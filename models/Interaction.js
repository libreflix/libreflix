const mongoose = require('mongoose');

const schemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
};

const interactionSchema = new mongoose.Schema({
    attachedToWatch: {type: mongoose.Schema.ObjectId, ref: 'Watch'},
    creator: {type: mongoose.Schema.ObjectId, ref: 'User'},
    proofhash: {type: String, unique: true},
    stars: Number,
    alreadyWatched: Boolean,
    favorite: Boolean,
    date: Date
}, schemaOptions);


const Interaction = mongoose.model('Interaction', interactionSchema);

module.exports = Interaction;
