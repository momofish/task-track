var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  title: { type: String, index: true }, 
  createdOn: Date
});

module.exports = mongoose.model('Tag', schema);