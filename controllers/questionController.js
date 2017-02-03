import mongoose from 'mongoose';
import moment from 'moment';
import { assign } from 'lodash'

import { api, route, paging } from '../utils';
import { Question, Tag } from '../models';

module.exports = function (router) {
  router.route('/questions/:category/:filter/:pageNo?')
    .get(route.wrap(async (req, res, next) => {
      let {user} = req;
      let {category, filter, pageNo = 1} = req.params;
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
        assign(params, { answerNum: 0 });
      }
      else if (category == 't') { // 按tag
        let tag = await Tag.findOne({ name: filter });
        assign(params, { tags: { $in: [(tag || {})._id] } });
      }
      else if (category == 'u') { // 按用户
        assign(params, { author: filter });
      }
      else if (category == 'my') { // 我的问答
        if (filter == 'answered')
          assign(params, { answers: { $elemMatch: { author: [user._id] } } })
        else
          assign(params, { author: user });
      }
      else {
        throw new Error('invalid params for questions')
      }

      let pageSize = 20;

      let totalCount = await Question.find(params).count();
      let list = await Question.find(params)
        .sort('-createdOn')
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize)
        .select('-answers -content')
        .populate('author tags', 'name title');

      res.send({ pagination: { pageNo, pageSize, totalCount }, list: list });
    }));

  router.route('/questions/:id')
    .get(route.wrap(async (req, res, next) => {
      let {id} = req.params;

      let question = await Question.findById(id)
        .populate('author tags answers.author', 'id name title');
      await Question.update({ _id: id }, { $inc: { visits: 1 } })

      res.send(question);
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

  router.route('/questions/:id/:field')
    .put(route.wrap(async (req, res, next) => {
      var user = req.user;
      let {id, field} = req.params;
      var question = await Question.findById(id);
      if (!question)
        throw new Error('问题不存在');

      let value = req.body;
      Object.assign(value, {
        author: user
      });
      question[field].push(value);
      if (field == 'answers') {
        question.answerNum = question[field].length;
        question.answeredOn = new Date();
        question.answeredBy = user;
      }

      await question.save();

      res.sendStatus(204);
    }))
}