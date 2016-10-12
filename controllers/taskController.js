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
    else {
      let parts = category.split('_');
      params.project = parts[0];
      params.packet = parts[1] || null;
    }
    if (filter == 'uncompleted')
      params.completed = false;
    else if (filter == 'completed')
      params.completed = true;
    Task.find(params)
      .select('completed project owner title treat dueDate startDate endDate')
      .populate('owner project', 'name').exec(function (err, tasks) {
        if (err) return next(err);

        res.send(tasks);
      });
  });

  router.route('/tasks/:id').get(function (req, res, next) {
    var user = req.user;
    var id = req.params.id;
    Task.findById(id).populate('owner members', 'name').populate('project').exec(function (err, task) {
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
    .post(async function (req, res, next) {
      let task = req.body;
      let oldTask = await Task.findById(task._id);
      // 设置为现在做时记录开始日期
      if (task.treat == 10 && oldTask.treat != task.treat && !task.startDate) {
        task.startDate = new Date();
      }
      // 设置完成时记录结束日期
      if (task.completed && oldTask.completed != task.completed) {
        task.endDate = new Date();
      }
      Task.update({ _id: task._id }, task, function (err) {
        if (err) return next(err);

        res.sendStatus(204);
      });
      return;
    });
}