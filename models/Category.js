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
* This is the Category schema. Each category can have a parent category.
* The preposition helps on exhibition of that category in the interface, and it is
* direct linked with the parent category.
* i.e. parent: documentary; genre: anarchism; preposition: about;
* So we will have on some pages the exhibition: Documentaries about Anarchism
*/

const categorySchema = new mongoose.Schema({
    nid: {type: String, unique: true},
    format: String,
    title: String
}, schemaOptions);


const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
