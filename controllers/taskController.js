var mongoose = require("mongoose");
var Task = require("../models/task");
var _ = require('underscore');

module.exports = function(router) {
  router.route('/tasks/my').get(function(req, res, next) {
    var user = req.user;
    Task.find({ assignee: user._id }).populate('assignee project').exec(function(err, tasks) {
      if (err) return next(err);

      res.send(tasks);
    });
  });
  
  router.route('/tasks').put(function (req, res, next) {
    var user = req.user;
    var task = new Task(req.body);
    task.assignee = user._id;
    task.save(function (err){
      if (err) return next(err);
      
      res.sendStatus(204);
    })
  })
}