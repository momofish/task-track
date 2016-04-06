var mongoose = require("mongoose");
var Character = require("../models/character");

module.exports = function (router){
  router.route("/count").get(function(req, res, next) {
    Character.count({}, function(err, count) {
        if (err) return next(err);
        
        res.send({ count: count });
    });
  });
}