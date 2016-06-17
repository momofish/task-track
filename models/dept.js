var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  id: { Type: String, unique: true },
  name: String,
  enabled: { Type: Boolean, index: true },
  parent: { type: Types.ObjectId, index: true, ref: 'Dept' },
  children: [{ type: Types.ObjectId, index: true, ref: 'Dept' }]
});

module.exports = mongoose.model('Dept', schema);