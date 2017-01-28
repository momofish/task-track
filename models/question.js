var mongoose = require('mongoose');
var Answer = require('./answer');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  title: String,
  author: { type: Types.ObjectId, index: true, ref: 'User' },
  content: String,
  answers: [Answer],
  reward: { type: Number, default: 0 },
  visits: { type: Number, default: 0 },
  answerNum: { type: Number, default: 0 },
  resolved: { type: Boolean, default: false },
  tags: [{ type: Types.ObjectId, index: true, ref: 'Tag' }],
  createdOn: { type: Date, index: true, default: Date.now },
  answeredOn: Date,
  answeredBy: { type: Types.ObjectId, index: true, ref: 'User' }
});

module.exports = mongoose.model('Question', schema);