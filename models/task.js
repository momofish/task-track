var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  title: String,
  project: { type: Types.ObjectId, index: true, ref: 'Project' },
  dueDate: Date,
  owner: { type: Types.ObjectId, index: true, ref: 'User' },
  members: [{ type: Types.ObjectId, index: true, ref: 'User' }],
  completed: { type: Boolean, index: true, default: false },
  treat: { type: Number, default: 0 },
  description: String
}, {
    versionKey: false
});

module.exports = mongoose.model('Task', schema);