var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var Answer = require('./answer');

var schema = new Schema({
  title: String,
  author: { type: Types.ObjectId, index: true, ref: 'User' },
  content: String,
  tags: [{ type: Types.ObjectId, index: true, ref: 'Tag' }],
  reward: { type: Number, default: 0 },
  createdOn: { type: Date, index: true, default: Date.now },

  visitNum: { type: Number, default: 0 },
  answers: [Answer],
  answerNum: { type: Number, default: 0 },
  answeredOn: Date,
  answeredBy: { type: Types.ObjectId, index: true, ref: 'User' },
  voteNum: Number,

  resolved: { type: Boolean, default: false },
});

module.exports = mongoose.model('Question', schema);