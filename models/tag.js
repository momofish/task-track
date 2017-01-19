var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  name: { type: String, index: true }, 
  createdOn: Date
});

module.exports = mongoose.model('Tag', schema);