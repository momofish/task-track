var mongoose = require("mongoose");
var models = require("../models");
var User = models.User;
var Dept = models.Dept;

module.exports = function (router) {
  router.route('system/syncOu').get(function (req, res, next) {
    Dept.find().exec(function (err, depts) {

      User.find().exec(function (err, users) {
        if (err) return next(err);
      });
    });
  });
}