var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  id: { type: String, index: true },
  name: String,
  enabled: { type: Boolean, index: true },
  parent: { type: Types.ObjectId, index: true, ref: 'Dept' },
});

module.exports = mongoose.model('Dept', schema);