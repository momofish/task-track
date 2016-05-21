var mongoose = require("mongoose");
var Project = require("../models").Project;

module.exports = function(router) {
  router.route('/projects/my').get(function(req, res, next) {
    var user = req.user;
    Project.find({ pm: user._id }).populate('pm').exec(function(err, projects) {
      if (err) return next(err);

      res.send(projects);
    });
  });

  router.route('/projects/mypart').get(function(req, res, next) {
    var user = req.user;
    Project.where('members').in([user._id]).populate('pm').exec(function(err, projects) {
      if (err) return next(err);

      res.send(projects);
    });
  });
  
  router.route('/projects/:id').get(function (req, res, next) {
    var id = req.params.id;
    Project.findById(id).populate('pm members').exec(function(err, project) {
      if (err) return next(err);

      res.send(project);
    });
  });
  
  router.route('/projects').put(function (req, res, next) {
    var user = req.user;
    var project = new Project(req.body);
    project.assignee = user._id;
    project.save(function (err){
      if (err) return next(err);
      
      res.sendStatus(204);
    });
  })
}