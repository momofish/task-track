var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var Vote = require('./vote');

var schema = new Schema({
  _id: String,
  voteNum: Number,
  votes: [Vote]
});

module.exports = mongoose.model('VoteStat', schema);