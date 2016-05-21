var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  name: String,
  parent: { type: Types.ObjectId, index: true, ref: 'Dept' },
  children: [{ type: Types.ObjectId, index: true, ref: 'Dept' }],
  manager: { type: Types.ObjectId, index: true, ref: 'User' }
});

module.exports = mongoose.model('Dept', schema);