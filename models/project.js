var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

module.exports = mongoose.model('Project', new Schema({
  projectId: { type: String, unique: true, index: true },
  projectName: String,
  type: { type: Number, required: true },
  pm: { type: Types.ObjectId, index: true, ref: 'User' },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}));