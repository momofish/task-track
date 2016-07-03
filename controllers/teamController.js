var mongoose = require("mongoose");
var Team = require("../models").Team;

module.exports = function (router) {
  router.route('/teams/my').get(function (req, res, next) {
    var user = req.user;
    Team.find({ owner: user._id }).populate('owner', 'name')
      .exec(function (err, teams) {
        if (err) return next(err);

        res.send(teams);
      });
  });

  router.route('/teams/part').get(function (req, res, next) {
    var user = req.user;
    Team.find({
      $or: [
        { owner: user._id },
        { members: { $in: [user._id] } }
      ]
    }).populate('owner', 'name')
      .exec(function (err, teams) {
        if (err) return next(err);

        res.send(teams);
      });
  });

  router.route('/teams/:id').get(function (req, res, next) {
    var id = req.params.id;
    Team.findById(id).populate('owner members', 'name')
      .exec(function (err, team) {
        if (err) return next(err);

        res.send(team);
      });
  });

  router.route('/teams').put(function (req, res, next) {
    var user = req.user;
    var team = new Team(req.body);
    
    if (!team.owner)
      team.owner = user._id;
    if (!team.members.length)
      team.members = [user._id];
    team.save(function (err) {
      if (err) return next(err);

      res.sendStatus(204);
    });
  }).post(function (req, res, next) {
    var team = req.body;
    Team.update({ _id: team._id }, team, function (err) {
      if (err) return next(err);

      res.sendStatus(204);
    });
  });
}