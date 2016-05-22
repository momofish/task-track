var mongoose = require("mongoose");
var Task = require("../models").Task;

module.exports = function (router) {
  router.route('/tasks/my').get(function (req, res, next) {
    var user = req.user;
    Task.find({ assignee: user._id }).populate('assignee project').exec(function (err, tasks) {
      if (err) return next(err);

      res.send(tasks);
    });
  });

  router.route('/tasks/:id').get(function (req, res, next) {
    var user = req.user;
    var id = req.params.id;
    Task.findById(id).populate('assignee project').exec(function (err, task) {
      if (err) return next(err);

      res.send(task);
    });
  });

  router.route('/tasks').put(function (req, res, next) {
    var user = req.user;
    var task = new Task(req.body);
    task.assignee = user._id;
    task.save(function (err) {
      if (err) return next(err);

      res.sendStatus(204);
    });
  })


  router.route('/tasks').post(function (req, res, next) {
    Task.findById(req.body._id, function (err, task) {
      if (err) return next(err);

      Object.assign(task, req.body);
      task.save(function (err) {
        if (err) return next(err);

        res.sendStatus(204);
      });
    });
  })
}