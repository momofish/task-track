module.exports = function (app) {
  var router = require("express").Router();
  router.app = app;
  router.use(function controllCache(req, res, next) {
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });
  app.use('/api', router);

  require('./systemController')(router);
  require('./assetController')(router);

  require('./projectController')(router);
  require('./taskController')(router);
  require('./teamController')(router);
  require('./deptController')(router);
  require('./userController')(router);
  require('./workloadController')(router);
  require('./articleController')(router);

  require('./knowController')(router);
  require('./questionController')(router);
  require('./tagController')(router);
  require('./blogController')(router);
}