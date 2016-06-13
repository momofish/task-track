module.exports = function(app) {
  var router = require("express").Router();
  app.use('/api', router);
  
  require('./projectController')(router);
  require('./taskController')(router);
  require('./teamController')(router);
  require('./deptController')(router);
  require('./userController')(router);
}