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
  });

  router.route('/tasks').put(function (req, res, next) {
    var user = req.user;
    var task = new Task(req.body);
    if (!task.owner)
      task.owner = user._id;
    if (!task.members)
      task.members = [user._id];
    task.save(function (err) {
      if (err) return next(err);

      res.sendStatus(204);
    });
  })

  router.route('/tasks').post(function (req, res, next) {
    Task.findById(req.body._id, function (err, task) {
      if (err) return next(err);

      if (!task) {
        res.sendStatus(500, 'task not found');
        return;
      }

      Object.assign(task, req.body);
      task.save(function (err) {
        if (err) return next(err);

        res.sendStatus(204);
      });
    });
  })
}