import mongoose from 'mongoose';
import moment from 'moment';
import { assign } from 'lodash'

import { api, route } from '../utils';
import { Question, Tag } from '../models';

module.exports = function (router) {
  router.route('/questions/:category/:filter?').get(route.wrap(async (req, res, next) => {
    let {user} = req;
    let {category, filter} = req.params;
    let params = {};

    if (category == 'latest') { // 最近：1个月内
      assign(params, {
        createdOn: { $gte: moment().add(-1, 'months').toDate() }
      });
    }
    else if (category == 'hot') {  // 热门：3个月内浏览量超过10
      assign(params, {
        createdOn: { $gte: moment().add(-3, 'months').toDate() },
        visits: { $gte: 10 }
      });
    }
    else if (category == 'unanswered') {  // 未回答的
      assign(params, {
        answers: 0
      });
    }
    else if (category == 't') { // 按tag
      let tag = await Tag.findOne({ name: filter });
      assign(params, {
        tag: { $in: [(tag || {})._id] }
      });
    }

    console.log(params)
    let questions = await Question.find(params)
      .select('-comments')
      .populate('author tags', 'id name title')

    res.send(questions);
  }));
}