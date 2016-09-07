var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  id: { type: String, index: true },
  name: String,
  type: { type: Number, required: true, default: 0 },
  team: { type: Types.ObjectId, index: true, ref: 'Team' },
  owner: { type: Types.ObjectId, index: true, ref: 'User' },
  members: [{ type: Types.ObjectId, ref: 'User' }],
  packets: [new Schema({ name: String, active: Boolean })],
});

module.exports = mongoose.model('Project', schema);