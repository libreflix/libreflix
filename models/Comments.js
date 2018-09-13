var mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  }
};

var commentSchema = new mongoose.Schema({
  date: Date,
  comments: [{
    body: String,
    date: Date,
    creator: { type : mongoose.Schema.ObjectId, ref : 'User' }
  }],
  attachedToUser: { type : mongoose.Schema.ObjectId, ref : 'User' },
  attachedToWatch: { type : mongoose.Schema.ObjectId, ref : 'Watch' },
}, schemaOptions);


var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
