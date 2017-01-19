import mongoose from 'mongoose';
import moment from 'moment';

import { api, route } from '../utils';
import { Question } from '../models';

module.exports = function (router) {
  router.route('/questions/:category').get(route.wrap(async (req, res, next) => {
    var user = req.user;
    var category = req.params.category;
    var params = {};

    if (category == 'my')
      params.author = user._id;

    let questions = await Question.find(params)
      .select('-comments')
      .populate('author tags', 'id name title')

    res.send(questions);
  }));
}