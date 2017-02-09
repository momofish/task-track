var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

module.exports = new Schema({
  author: { type: Types.ObjectId, unique: true, ref: 'User' },
  voteNum: Number,
  updatedOn: { type: Date, default: Date.now },
});