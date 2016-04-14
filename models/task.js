var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
  taskId: { type: String, unique: true, index: true },
  taskTitle: String,
  assignee: {type: String, ref: 'User'}
});

module.exports = mongoose.model('Task', taskSchema);