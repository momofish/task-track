import mongoose from 'mongoose';
import moment from 'moment';

import { api, route } from '../utils';
import { Task, Workload, Project } from '../models';

module.exports = function (router) {
  router.route('/tasks/:category/:filter').get(function (req, res, next) {
    var user = req.user;
    var category = req.params.category;
    var filter = req.params.filter;
    var params = {};
    var complex = null;

    if (category == 'my')
      params.owner = user._id;
    else if (category == 'part')
      params.members = { $elemMatch: { $in: [user._id] } };
    else if (category == 'mypart')
      complex = { $or: [{ owner: user._id }, { members: { $elemMatch: { $in: [user._id] } } }] }
    else {
      let parts = category.split('_');
      params.project = parts[0];
      params.packet = parts[1] || null;
    }

    if (filter == 'uncompleted')
      params.completed = false;
    else if (filter == 'completed')
      params.completed = true;

    Task.find(complex ? { $and: [complex, params] } : params)
      .sort('dueDate')
      .select('completed project owner title treat dueDate startDate endDate')
      .populate('owner project', 'id name').exec(function (err, tasks) {
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
  }).delete(route.wrap(async (req, res, next) => {
    let { id } = req.params;

    // check for workload
    let workload = await Workload.findOne({ task: id });
    if (workload)
      return next(new Error('已填工作量，无法删除'))

    Task.findByIdAndRemove(id, function (err) {
      if (err) return next(err);

      res.sendStatus(204);
    });
  }));

  router.route('/tasks')
    .put(route.wrap(async function (req, res, next) {
      var user = req.user;
      var task = new Task(req.body);
      let project = task.project;
      if (!project._id)
        project = await Project.findById(project, 'id name owner');
      // 除了部门经理
      if (project.id && project.owner != user._id) {
        // 不能帮别人创建任务
        if (task.owner && user._id != (task.owner._id || task.owner))
          throw new Error('想帮队友创建任务？找项目经理吧');
      }

      if (!task.owner)
        task.owner = user._id;

      task.save(function (err) {
        if (err) return next(err);

        res.sendStatus(204);
      });
    }))
    .post(route.wrap(async function (req, res, next) {
      var user = req.user;
      let task = req.body;
      let oldTask = await Task.findById(task._id).populate('project', 'id owner');
      // 除了部门经理
      if (oldTask.project && oldTask.project.id && user._id != oldTask.project.owner) {
        // 不能修改别人的任务
        if (user._id != oldTask.owner)
          throw new Error('想帮队友完成任务？找项目经理变更任务所有者吧');
        // 公司项目，自己不能把任务转给别人
        if (task.owner && user._id != (task.owner || {})._id)
          throw new Error('想请队友帮忙完成任务？找项目经理变更任务吧');
      }

      // 设置为现在做时记录开始日期
      if (task.treat == 10 && oldTask.treat != task.treat && !task.startDate) {
        task.startDate = moment().startOf('day');
      }
      // 设置完成时，或所有检查点标记完成记录结束日期
      if (task.completed && oldTask.completed != task.completed ||
        task.subTasks && task.subTasks.length && !task.subTasks.some(s => !s.completed) && oldTask.subTasks.some(s => !s.completed)) {
        task.completed = true;
        task.endDate = moment().startOf('day');
        if (!oldTask.startDate)
          task.startDate = moment().startOf('day');
      }
      Task.update({ _id: task._id }, task, function (err) {
        if (err) return next(err);

        res.send(task);
      });
      return;
    }));
}