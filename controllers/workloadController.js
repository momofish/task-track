var mongoose = require("mongoose");
var Task = require("../models").Task;

let wrap = fn => (...args) => fn(...args).catch(args[2])

module.exports = function (router) {
  router.route('/workload/:mode/:date').get(wrap(async (req, res) => {
    let result = await Task.find();

    res.send(result);
  }));
}