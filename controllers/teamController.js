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
    Team.where('members').in([user._id]).populate('owner', 'name')
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
    team.owner = user._id;
    team.members = [user._id];
    team.save(function (err) {
      if (err) return next(err);

      res.sendStatus(204);
    });
  })

  router.route('/teams').post(function (req, res, next) {
    Team.findById(req.body._id, function (err, team) {
      if (err) return next(err);

      if (!team) {
        res.sendStatus(500, 'team not found');
        return;
      }

      Object.assign(team, req.body);
      team.save(function (err) {
        if (err) return next(err);

        res.sendStatus(204);
      });
    });
  })
}