var mongoose = require("mongoose");
var Project = require("../models").Project;
var Team = require("../models").Team;

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
  });

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