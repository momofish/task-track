var mongoose = require('mongoose');
var Comment = require('./comment');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  title: String,
  author: { type: Types.ObjectId, index: true, ref: 'User' },
  content: String,
  tags: [{ type: Types.ObjectId, index: true, ref: 'Tag' }],
  createdOn: { type: Date, index: true, default: Date.now },

  visitNum: { type: Number, default: 0 },
  comments: [Comment],
  commentNum: { type: Number, default: 0 },
  commentedOn: Date,
  commentedBy: { type: Types.ObjectId, index: true, ref: 'User' },
  voteNum: Number,
});

module.exports = mongoose.model('Blog', schema);