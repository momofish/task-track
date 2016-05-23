var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  title: String,
  project: {type: Types.ObjectId, index: true, ref: 'Project'},
  dueDate: Date,
  assignee: {type: Types.ObjectId, index: true, ref: 'User'},
  completed: Boolean
});

module.exports = mongoose.model('Task', schema);