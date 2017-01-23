var mongoose = require('mongoose');
var Comment = require('./comment');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  title: String,
  content: String,
  author: { type: Types.ObjectId, index: true, ref: 'User' },
  comments: [Comment],
  reward: { type: Number, default: 0 },
  answers: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  resolved: { type: Boolean, default: false },
  tags: [{ type: Types.ObjectId, index: true, ref: 'Tag' }],
  createdOn: { type: Date, index: true, default: new Date() },
  answeredOn: Date,
  answeredBy: { type: Types.ObjectId, index: true, ref: 'User' }
});

module.exports = mongoose.model('Question', schema);