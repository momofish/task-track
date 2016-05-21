var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  projectId: { type: String, unique: true, index: true },
  projectName: String,
  type: { type: Number, required: true },
  team: { type: Types.ObjectId, index: true, ref: 'Team' },
  pm: { type: Types.ObjectId, index: true, ref: 'User' },
  members: [{ type: Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Project', schema);