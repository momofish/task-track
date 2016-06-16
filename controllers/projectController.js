var mongoose = require("mongoose");
var Project = require("../models").Project;

module.exports = function (router) {
  router.route('/projects/my').get(function (req, res, next) {
    var user = req.user;
    Project.find({ owner: user._id }).populate('owner members team').exec(function (err, projects) {
      if (err) return next(err);

      res.send(projects);
    });
  });

  router.route('/projects/part').get(function (req, res, next) {
    var user = req.user;
    Project.where('members').in([user._id]).populate('owner members team').exec(function (err, projects) {
      if (err) return next(err);

      res.send(projects);
    });
  });

  router.route('/projects/:id').get(function (req, res, next) {
    var id = req.params.id;
    Project.findById(id).populate('owner members team').exec(function (err, project) {
      if (err) return next(err);

      if (project.team) {
        project.team.populate('members', function (err, team) {
          if (err) return next(err);

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
    project.owner = req.body.owner || user._id;
    project.save(function (err) {
      if (err) return next(err);

      res.sendStatus(204);
    });
  })

  router.route('/projects').post(function (req, res, next) {
    Project.findById(req.body._id, function (err, project) {
      if (err) return next(err);

      if (!project) {
        res.sendStatus(500, 'project not found');
        return;
      }

      Object.assign(project, req.body);
      project.save(function (err) {
        if (err) return next(err);

        res.sendStatus(204);
      });
    });
  })
}