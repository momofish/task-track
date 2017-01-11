var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;

var schema = new Schema({
  key: { type: String, index: true },
  title: String,
  author: { type: Types.ObjectId, index: true, ref: 'User' },
  content: String,
  createdOn: { type: Date, default: new Date() },
  comments: [new Schema({
    author: { type: Types.ObjectId, index: true, ref: 'User' },
    content: String, reply: String, createdOn: { type: Date, default: new Date() }
  })],
}, { versionKey: false });

module.exports = mongoose.model('Article', schema);