var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

const getTags = tags => tags.join(',');
const setTags = tags => tags.split(',');

var watchSchema = new mongoose.Schema({
  /* Internal */
  permalink: {type: String, unique: true},
  criador: { type : mongoose.Schema.ObjectId, ref : 'User' },
  layout: String,
  featured: String,
  status: String,
  modComments: {
    moderator: { type : mongoose.Schema.ObjectId, ref : 'User'},
    status: String, // wainting, pending, approved, rejected,
    date: Date,
    comment: String
  },
  top: String,
  mod_message: String,
  downloadable: Boolean,
  canwecopy: Boolean,


  /* Basic */
  title: String,
  subtitle: String,
  original_title: String,
  year: Number,
  duration: Number, // in minutes
  classind: String,
  sinopse: String,

  /* More Info */
  description: String,
  license: String,
  location: {
    country:{
      code: String,
      name: String,
    },
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
    srt: String,
    ld: String,
    sd: String,
    hd: String,
    fhd: String,
    uhd: String
  },

  /* Categories */
  tags: { type: [], get: getTags, set: setTags },
  usertags: { type: [], get: getTags, set: setTags },
  categories: { type: []},
  format: String,

  /* External links */
  links: {
    website: String,
    wikipedia: String,
    twitter: String,
    imdb: String,
    filmow: String,
    facebook: String,
    instagram: String
  },

  /** New player options **/
  useWatchV2: Boolean,
  useWatchV3: Boolean,
  magnet: String,

  /* Download options */
  enableDownload: Boolean,
  enableDonations: Boolean,
  enableTrailer: Boolean,

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
