var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

const getTags = tags => tags.join(', ');
const setTags = tags => tags.split(', ');

/*
* This is the Category schema. Each category can has a parent category.
* The preposition helps on exibition of that category in the interface and it is
* direct linked with the parent category.
* i.e. parent: docummentary; genre: anarchism; preposition: about;
* So we will have on some pages the exibition: Documentaries about Anarchism
*/

var categorySchema = new mongoose.Schema({
  nid: {type: String, unique: true},
  format: String,
  title: String
}, schemaOptions);


var Category = mongoose.model('Category', categorySchema);

module.exports = Category;
