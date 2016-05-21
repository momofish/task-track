var mongoose = require("mongoose");
var Team = require("../models").Team;

module.exports = function(router) {
  router.route('/Teams/my').get(function(req, res, next) {
    var user = req.user;
    Team.find({ owner: user._id }).populate('owner').exec(function(err, teams) {
      if (err) return next(err);

      res.send(teams);
    });
  });
  
  router.route('/Teams/:id').get(function (req, res, next) {
    var id = req.params.id;
    Team.findById(id).populate('owner members').exec(function(err, team) {
      if (err) return next(err);

      res.send(team);
    });
  });
  
  router.route('/Teams').put(function (req, res, next) {
    var Team = new Team(req.body);
    Team.save(function (err){
      if (err) return next(err);
      
      res.sendStatus(204);
    });
  })
}