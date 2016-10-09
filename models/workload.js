var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  project: { type: Types.ObjectId, index: true, ref: 'Project' },
  task: { type: Types.ObjectId, ref: 'Task' },
  date: { type: Date, index: true },
  workload: Number,
  owner: { type: Types.ObjectId, index: true, ref: 'User' },
  status: Number, // 0： 待审批, 1, 审核中，2, 已通过， 3, 已拒绝
  opinion: String
}, { versionKey: false });

module.exports = mongoose.model('Workload', schema);