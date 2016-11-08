var mongoose = require("mongoose");
var User = require("../models").User;

module.exports = function (router) {
  router.route('/users').get(function (req, res, next) {
    User.find({ enabled: true }).exec(function (err, users) {
      if (err) return next(err);

      res.send(users);
    });
  });

  router.route('/users/:id').get(function (req, res, next) {
    var id = req.params.id;
    if (id == 'current')
      id = req.user._id;
    User.findById(id).populate('dept', 'name').exec(function (err, user) {
      if (err) return next(err);

      res.send(user);
    });
  });
}