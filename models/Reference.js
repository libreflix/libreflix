var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var refereceSchema = new mongoose.Schema({
  attachedToWatch: { type : mongoose.Schema.ObjectId, ref : 'Watch' },
  creator: { type : mongoose.Schema.ObjectId, ref : 'User' },
  url: String,
  title: String,
}, schemaOptions);


var Reference = mongoose.model('Reference', refereceSchema);

module.exports = Reference;
