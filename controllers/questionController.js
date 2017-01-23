import mongoose from 'mongoose';
import moment from 'moment';
import { assign } from 'lodash'

import { api, route, paging } from '../utils';
import { Question, Tag } from '../models';

module.exports = function (router) {
  router.route('/questions/:category/:filter?/:pageNo?')
    .get(route.wrap(async (req, res, next) => {
      let {user} = req;
      let {category, filter, pageNo = 1} = req.params;
      console.log(req.params)
      pageNo = parseInt(pageNo);

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
        assign(params, { answers: 0 });
      }
      else if (category == 't') { // 按tag
        let tag = await Tag.findOne({ name: filter });
        assign(params, { tags: { $in: [(tag || {})._id] } });
      }
      else if (category == 'u') { // 按用户
        assign(params, { author: filter });
      }

      let pageSize = 20;

      let totalCount = await Question.find(params).count();
      let list = await Question.find(params)
        .sort('-createdOn')
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize)
        .select('-comments -content')
        .populate('author tags', 'id name title');

      res.send({ pagination: { pageNo, pageSize, totalCount }, list: list });
    }));

  router.route('/questions')
    .put(route.wrap(async (req, res, next) => {
      var user = req.user;
      var question = new Question(req.body);

      question.author = user;

      await question.save();

      res.sendStatus(204);
    }))
    .post(route.wrap(async (req, res, next) => {
      var question = req.body;
      await Question.update({ _id: question._id }, question);

      res.sendStatus(204);
    }));
}