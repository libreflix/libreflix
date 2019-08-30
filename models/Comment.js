var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var commentSchema = new mongoose.Schema({
  attachedToUser: { type : mongoose.Schema.ObjectId, ref : 'User' },
  attachedToWatch: { type : mongoose.Schema.ObjectId, ref : 'Watch' },
  creator: { type : mongoose.Schema.ObjectId, ref : 'User' },
  date: Date,
  type: String, //public, admin, deleted
  body: String,
}, schemaOptions);


var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
