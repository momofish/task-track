var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  name: String,
  owner: { type: Types.ObjectId, index: true, ref: 'User' },
  members: [{ type: Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Team', schema);