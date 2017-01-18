import mongoose from 'mongoose';
import moment from 'moment';

import { api, route } from '../utils';
import { Question } from '../models';

module.exports = function (router) {
  router.route('/questions/:category').get(function (req, res, next) {
    var user = req.user;
    var category = req.params.category;
    var params = {};

    if (category == 'my')
      params.author = user._id;

    Question.find(params)
      .select('title answers visitors author')
      .populate('author', 'id name').exec(function (err, tasks) {
        if (err) return next(err);

        res.send(tasks);
      });
  });
}
