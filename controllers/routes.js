module.exports = function(app) {
  var router = require("express").Router();
  app.use('/api', router);
  
  require('./controller')(router);
};