var mongoose = require('mongoose');

module.exports = mongoose.model('Project', new mongoose.Schema({
  projectId: { type: String, unique: true, index: true },
  projectName: String
}));