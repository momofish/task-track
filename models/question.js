var mongoose = require('mongoose');
var Comment = require('./comment');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  title: String,
  content: String,
  author: { type: Types.ObjectId, index: true, ref: 'User' },
  comments: [Comment],
  reward: Number,
  answers: Number,
  visits: Number,
  resolved: Boolean,
  tags: [{ type: Types.ObjectId, index: true, ref: 'Tag' }],
  createdOn: { type: Date, default: new Date() },
  answeredOn: Date,
  answeredBy: { type: Types.ObjectId, index: true, ref: 'User' }
});

module.exports = mongoose.model('Question', schema);