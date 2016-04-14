var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, index: true },
  userName: String
});

module.exports = mongoose.model('User', userSchema);