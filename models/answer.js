var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

module.exports = new Schema({
  author: { type: Types.ObjectId, index: true, ref: 'User' },
  content: String,
  accepted: Boolean,
  createdOn: { type: Date, index: true, default: Date.now },
  isAnswer: Boolean
});