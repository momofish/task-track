var mongoose = require('mongoose');
var Types = mongoose.Schema.Types;

module.exports = mongoose.model('Project', new mongoose.Schema({
  projectId: { type: String, unique: true, index: true },
  projectName: String,
  type: { type: Number, required: true },
  pm: { type: Types.ObjectId, index: true, ref: 'User' },
}));