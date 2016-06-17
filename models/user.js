var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  id: { type: String, index: true },
  name: String,
  dept: { type: Types.ObjectId, index: true, ref: 'Dept' },
  loginId: { type: String, unique: true, index: true },
  password: String,
  enabled: Boolean
});

module.exports = mongoose.model('User', schema);