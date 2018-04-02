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
  /* Internal */
  permalink: {type: String, unique: true},
  criador: { type : mongoose.Schema.ObjectId, ref : 'User' },
  layout: String,
  featured: String,
  status: String,
  top: String,
  mod_message: String,
  downloadable: String,
  canwecopy: String,


  /* Basic */
  title: String,
  subtitle: String,
  original_title: String,
  year: Number,
  duration: String,
  classind: String,
  sinopse: String,

  /* More Info */
  description: String,
  license: String,
  location: {
    country: String,
    state: String,
    city: String,
    lat: String,
    lon: String
  },
  crew: {
    director:  { type: [], get: getTags, set: setTags },
    screenplay:  { type: [], get: getTags, set: setTags },
    producer:  { type: [], get: getTags, set: setTags },
    cast:  { type: [], get: getTags, set: setTags },
    editor:  { type: [], get: getTags, set: setTags },
    other: String,
  },

  /* Images */
  imgbg: String,
  thumb480: String,
  thumb130: String,

  /* Video */
  video: String,
  trailer: String,
  quality: String,
  audio_language: String,
  srt_language: { type: [], get: getTags, set: setTags },

  /* Files and Download*/
  file: {
    film: String,
    trailer: String,
    srt: String
  },

  /* Categories */
  tags: { type: [], get: getTags, set: setTags },

  /* For Series */
  n_eps: Number,
  eps: [{   last: Boolean,
            subtitle : String,
            video : String,
            thumb480 : String,
            thumb130 : String}]
}, schemaOptions);


var Watch = mongoose.model('Watch', watchSchema);

module.exports = Watch;
