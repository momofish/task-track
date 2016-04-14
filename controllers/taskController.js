var mongoose = require("mongoose");
var Task = require("../models/task");
var _ = require('underscore');

module.exports = function(router) {

  router.route('/tasks/my').get(function(req, res, next) {
    Task.find({ assignee: null }, function(err, tasks) {
      if (err) return next(err);

      res.send(tasks);
    });
  });
}