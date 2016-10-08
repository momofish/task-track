var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  project: { type: Types.ObjectId, index: true, ref: 'Project' },
  task: { type: Types.ObjectId, ref: 'Task' },
  date: { type: Date, index: true },
  workload: Number,
  owner: { type: Types.ObjectId, index: true, ref: 'User' },
}, { versionKey: false });

module.exports = mongoose.model('Workload', schema);