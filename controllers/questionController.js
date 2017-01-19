import mongoose from 'mongoose';
import moment from 'moment';

import { api, route } from '../utils';
import { Question } from '../models';

module.exports = function (router) {
  router.route('/questions/:category/:filter?').get(route.wrap(async (req, res, next) => {
    var user = req.user;
    var category = req.params.category;
    var params = {};

    if (category == 'latest') // 最近1个月
      params.createdOn = { $gte: moment().add(-1, 'months').toDate() }
    if (category == 'hot')  // 本月
      params.createdOn = { $gte: moment().add(-1, 'months').toDate() }
    
    console.log(params)
    let questions = await Question.find(params)
      .select('-comments')
      .populate('author tags', 'id name title')

    res.send(questions);
  }));
}