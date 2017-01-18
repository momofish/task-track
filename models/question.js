var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  title: String,
  content: String,
  author: { type: Types.ObjectId, index: true, ref: 'User' },
  comments: [new Schema({ name: String, answered: Boolean })],
  answers: Number,
  visitors: Number,
  createdOn: { type: Date, default: new Date() },
});

module.exports = mongoose.model('Question', schema);