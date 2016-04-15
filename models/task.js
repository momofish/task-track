var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  taskId: { type: String, unique: true, index: true },
  title: String,
  project: {type: mongoose.Schema.Types.ObjectId, index: true, ref: 'Project'},
  dueDate: Date,
  assignee: {type: mongoose.Schema.Types.ObjectId, index: true, ref: 'User'}
});

module.exports = mongoose.model('Task', taskSchema);