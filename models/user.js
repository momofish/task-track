var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  id: { type: String, unique: true, index: true },
  loginId: { type: String, unique: true, index: true },
  password: String,
  name: String
});

module.exports = mongoose.model('User', userSchema);