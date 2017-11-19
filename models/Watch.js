var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

const getTags = tags => tags.join(', ');
const setTags = tags => tags.split(', ');

var watchSchema = new mongoose.Schema({
  permalink: {type: String, unique: true},
  criador: { type : mongoose.Schema.ObjectId, ref : 'User' },
  layout: String,
  title: String,
  subtitle: String,
  sinopse: String,
  license: String,
  year: Number,
  classind: String,
  duration: String,
  imgbg: String,
  video: String,
  thumb480: String,
  thumb130: String,
  runtime: String,
  tags: { type: [], get: getTags, set: setTags },
  featured: String,
  top: String,
  n_eps: Number,
  eps: [{   last: Boolean,
            subtitle : String,
            video : String,
            thumb480 : String,
            thumb130 : String}]
}, schemaOptions);


var Watch = mongoose.model('Watch', watchSchema);

module.exports = Watch;
