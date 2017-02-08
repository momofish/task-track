var mongoose = require('mongoose');
var Comment = require('./comment');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  title: String,
  author: { type: Types.ObjectId, index: true, ref: 'User' },
  content: String,
  comments: [Comment],
  visits: { type: Number, default: 0 },
  commentNum: { type: Number, default: 0 },
  tags: [{ type: Types.ObjectId, index: true, ref: 'Tag' }],
  createdOn: { type: Date, index: true, default: Date.now },
  commentedOn: Date,
  commentedBy: { type: Types.ObjectId, index: true, ref: 'User' }
});

module.exports = mongoose.model('Blog', schema);