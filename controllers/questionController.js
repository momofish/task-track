import mongoose from 'mongoose';
import moment from 'moment';
import { assign } from 'lodash'

import { api, route, paging } from '../utils';
import { Question, Tag, User, VoteStat } from '../models';

const voteEntity = async (entity, vote) => {
  // load votestat
  let voteStat = await VoteStat.findById(entity._id);
  console.log(voteStat);
  if (!voteStat)
    voteStat = new VoteStat(Object.assign({}, entity));

  // modify votestat
  let oldVote = voteStat.votes.find(v => v.author._id == vote.author._id);
  if (oldVote)
    Object.assign(oldVote, vote);
  else
    voteStat.votes.push(vote);
  voteStat.voteNum = voteStat.votes.reduce((acc, cur) => acc + cur.voteNum, 0);

  await voteStat.save();
  entity.voteNum = voteStat.voteNum;
}

module.exports = function (router) {
  router.route('/questions/:category/:filter/:pageNo?')
    .get(route.wrap(async (req, res, next) => {
      let {user} = req;
      let {category, filter, pageNo = 1} = req.params;
      pageNo = parseInt(pageNo);

      let params = {};
      let head;

      if (category == 'latest') { // 最近：1个月内
        assign(params, {
          createdOn: { $gte: moment().add(-1, 'months').toDate() }
        });
      }
      else if (category == 'hot') {  // 热门：3个月内浏览量超过10
        assign(params, {
          createdOn: { $gte: moment().add(-3, 'months').toDate() },
          visitNum: { $gte: 10 }
        });
      }
      else if (category == 'unanswered') {  // 未回答的
        assign(params, { answerNum: 0 });
      }
      else if (category == 't') { // 按tag
        let tag = await Tag.findOne({ name: filter });
        assign(params, { tags: { $in: [(tag || {})._id] } });
        head = tag;
      }
      else if (category == 'u') { // 按用户
        let u = await User.findOne({ loginId: filter });
        assign(params, { author: u });
        head = u;
      }
      else if (category == 'my') { // 我的问答
        if (filter == 'answered')
          assign(params, { answers: { $elemMatch: { author: [user._id] } } })
        else
          assign(params, { author: user });
      }
      else if (category == 'search') {
        assign(params, { title: new RegExp(`${filter}`, 'i') })
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
        .select('-answers -votes -content')
        .populate('author tags', 'name title loginId');

      res.send({ pagination: { pageNo, pageSize, totalCount }, list, head });
    }));

  router.route('/questions/:id?')
    .get(route.wrap(async (req, res, next) => {
      let {user} = req;
      let {id} = req.params;

      let question = await Question.findById(id)
        .populate('author tags answers.author', 'id name title loginId');

      res.send(question);

      await Question.update({ _id: id }, { $inc: { visitNum: 1 } });
    }))
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
        throw new Error('question does not exist');

      let value = req.body;
      Object.assign(value, {
        author: user
      });

      let children = question[field];
      if (children instanceof Array)
        children.push(value);
      if (field == 'answers') {
        question.answerNum = children.length;
        question.answeredOn = new Date();
        question.answeredBy = user;
      }
      else if (field == 'votes') {
        await voteEntity(question, value);
      }

      await question.save();

      res.sendStatus(204);
    }))
    .post(route.wrap(async (req, res, next) => {
      var user = req.user;
      let {id, field} = req.params;
      var question = await Question.findById(id);
      if (!question)
        throw new Error('question does not exist');

      let value = req.body;

      let children = question[field];
      let child = children.find(answer => answer._id == value._id);
      Object.assign(child, value);
      if (field == 'answers') {
        question.resolved = children.some(answer => answer.accepted);
      }
      else if (field == 'votes') {
        sumVote(question);
      }

      await question.save();

      res.sendStatus(204);
    }))
}