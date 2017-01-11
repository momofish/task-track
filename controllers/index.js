module.exports = function(app) {
  var router = require("express").Router();
  app.use('/api', router);
  
  require('./systemController')(router);

  require('./projectController')(router);
  require('./taskController')(router);
  require('./teamController')(router);
  require('./deptController')(router);
  require('./userController')(router);
  require('./workloadController')(router);
  require('./articleController')(router);
}