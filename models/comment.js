var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  author: { type: Types.ObjectId, index: true, ref: 'User' }, 
  content: String, 
  isAnswer: Boolean
});

module.exports = mongoose.model('Comment', schema);