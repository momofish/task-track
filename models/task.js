var mongoose = require('mongoose');
var Types = mongoose.Schema.Types;

var taskSchema = new mongoose.Schema({
  title: String,
  project: {type: Types.ObjectId, index: true, ref: 'Project'},
  dueDate: Date,
  assignee: {type: Types.ObjectId, index: true, ref: 'User'}
});

module.exports = mongoose.model('Task', taskSchema);