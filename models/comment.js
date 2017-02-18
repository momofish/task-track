var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var Reply = require('./reply');

module.exports = new Schema({
  author: { type: Types.ObjectId, index: true, ref: 'User' },
  content: String,
  createdOn: { type: Date, index: true, default: Date.now },
  voteNum: Number,

  replies: [Reply],
});