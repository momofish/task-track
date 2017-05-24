const mongoose = require("mongoose");
const { Project, Team, Task } = require("../models");
const { api, route } = require('../utils');

module.exports = function (router) {
  router.route('/projects/my').get(function (req, res, next) {
    var user = req.user;
    Project.find({ owner: user._id }).populate('owner members team', 'name').exec(function (err, projects) {
      if (err) return next(err);

      res.send(projects);
    });
  });

  router.route('/projects/part').get(function (req, res, next) {
    var user = req.user;
    Project.find({
      $or: [
        { owner: user._id },
        { members: { $in: [user._id] } }
      ]
    }).populate('owner members team', 'name').exec(function (err, projects) {
      if (err) return next(err);

      res.send(projects);
    });
  });

  router.route('/projects/:id').get(function (req, res, next) {
    var id = req.params.id;
    Project.findById(id).populate('owner members', 'name').exec(function (err, project) {
      if (err) return next(err);

      if (!project) {
        return res.send(project);
      }

      if (project.team) {
        Team.findById(project.team).populate('members', 'name').exec(function (err, team) {
          if (err) return next(err);

          project.team = team;
          res.send(project);
        });
      }
      else
        res.send(project);
    });
  }).delete(route.wrap(async (req, res, next) => {
    let { id } = req.params;

    // check task
    let project = await Project.findById(id);
    if (project.id) {
      let task = await Task.findOne({ project: id });
      if (task)
        throw new Error('该项目存在，无法删除');
    }

    await Task.remove({project: project.id});
    await Project.findByIdAndRemove(id);
    res.sendStatus(204);
  }));

  router.route('/projects').put(function (req, res, next) {
    var user = req.user;
    var project = new Project(req.body);

    if (!project.owner)
      project.owner = user._id;
    if (!project.members.length)
      project.members = [user._id];

    project.save(function (err) {
      if (err) return next(err);

      res.sendStatus(204);
    });
  }).post(function (req, res, next) {
    var project = req.body;
    Project.update({ _id: project._id }, project, function (err) {
      if (err) return next(err);

      res.sendStatus(204);
    });
  });
}