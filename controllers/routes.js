module.exports = function(app) {
  var router = require("express").Router();
  app.use('/api/characters', router);
  
  require('./characterController')(router);
}