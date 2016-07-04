var mongoose = require("mongoose");
var Task = require("../models").Task;

module.exports = function (router) {
  router.route('/tasks/:category/:filter').get(function (req, res, next) {
    var user = req.user;
    var category = req.params.category;
    var filter = req.params.filter;
    var params = {};
    if (category == 'my')
      params.owner = user._id;
    else if (category == 'part')
      params.members = { $elemMatch: { $in: [user._id] } };
    else
      params.project = category;
    if (filter == 'uncompleted')
      params.completed = false;
    else if (filter == 'completed')
      params.completed = true;
    Task.find(params).populate('owner project', 'name').exec(function (err, tasks) {
      if (err) return next(err);

      res.send(tasks);
    });
  });

  router.route('/tasks/:id').get(function (req, res, next) {
    var user = req.user;
    var id = req.params.id;
    Task.findById(id).populate('owner members project', 'name').exec(function (err, task) {
      if (err) return next(err);

      res.send(task);
    });
  }).delete(function (req, res, next) {
    var id = req.params.id;
    Task.findByIdAndRemove(id, function (err) {
        if (err) return next(err);

        res.sendStatus(204);
    });
  });

  router.route('/tasks')
    .put(function (req, res, next) {
      var user = req.user;
      var task = new Task(req.body);

      if (!task.owner)
        task.owner = user._id;
      if (!task.members.length)
        task.members = [user._id];

      task.save(function (err) {
        if (err) return next(err);

        res.sendStatus(204);
      });
    })
    .post(function (req, res, next) {
      var task = req.body;
      Task.update({ _id: task._id }, task, function (err) {
        if (err) return next(err);

        res.sendStatus(204);
      });
      return;
    });
}