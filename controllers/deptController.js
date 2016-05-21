var mongoose = require("mongoose");
var Dept = require("../models").Dept;

module.exports = function(router) {
  router.route('/depts/my').get(function(req, res, next) {
    var user = req.user;
    Dept.find({ manager: user._id }).populate('manager,parent,children').exec(function(err, depts) {
      if (err) return next(err);

      res.send(depts);
    });
  });
  
  router.route('/depts/:id').get(function (req, res, next) {
    var id = req.params.id;
    Dept.findById(id).populate('manager,parent,children').exec(function(err, dept) {
      if (err) return next(err);

      res.send(dept);
    });
  });
}