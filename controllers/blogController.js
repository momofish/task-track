import mongoose from 'mongoose';
import moment from 'moment';
import { assign } from 'lodash'

import { api, route } from '../utils';
import { Blog, Tag, User, VoteStat } from '../models';

export const vote4Entity = async (entity, vote) => {
  let {_id} = entity;
  // load votestat
  let voteStat = await VoteStat.findById(_id);
  if (!voteStat)
    voteStat = new VoteStat({ _id });

  // modify votestat
  let oldVote = voteStat.votes.find(v => v.author == vote.author._id);
  if (oldVote)
    Object.assign(oldVote, vote);
  else
    voteStat.votes.push(vote);
  let voteNum = voteStat.voteNum = voteStat.votes.reduce((acc, cur) => acc + cur.voteNum, 0);

  await voteStat.save();
  entity.voteNum = voteNum;
  return { voteNum };
}

module.exports = function (router) {
  router.route('/blogs/:category/:filter/:pageNo?')
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
      else if (category == 'my') { // 我的
        if (filter == 'commented')
          assign(params, { comments: { $elemMatch: { author: [user._id] } } })
        else
          assign(params, { author: user });
      }
      else if (category == 'search') {
        assign(params, { title: new RegExp(`${filter}`, 'i') })
      }
      else {
        throw new Error('invalid params for blogs')
      }

      let pageSize = 20;

      let totalCount = await Blog.find(params).count();
      let list = await Blog.find(params)
        .sort('-createdOn')
        .skip((pageNo - 1) * pageSize)
        .limit(pageSize)
        .select('-comments -content')
        .populate('author tags', 'name title loginId');

      res.send({ pagination: { pageNo, pageSize, totalCount }, list, head });
    }));

  router.route('/blogs/:id?')
    .get(route.wrap(async (req, res, next) => {
      let {id} = req.params;

      let blog = await Blog.findById(id)
        .populate('author tags comments.author', 'id name title loginId');
      res.send(blog);

      await Blog.update({ _id: id }, { $inc: { visitNum: 1 } })
    }))
    .put(route.wrap(async (req, res, next) => {
      var user = req.user;
      var blog = new Blog(req.body);

      blog.author = user;

      await blog.save();

      res.sendStatus(204);
    }))
    .post(route.wrap(async (req, res, next) => {
      var blog = req.body;
      await Blog.update({ _id: blog._id }, blog);

      res.sendStatus(204);
    }));

  router.route('/blogs/:id/:field/:cid?/:cfield?')
    .all(route.wrap(async (req, res, next) => {
      let {method} = req;
      if (method == 'GET')
        throw new Error('invalid verb');
      let user = req.user;
      let {id, field, cid, cfield} = req.params;
      let result;

      let blog = await Blog.findById(id);
      if (!blog)
        throw new Error('blog not found');

      let value = req.body;
      Object.assign(value, {
        author: user
      });

      let children = blog[field];
      // 操作孙节点
      if (cfield) {
        let child = children.id(cid);
        if (!child)
          throw new Error(`${field} for ${cid} not found`);
        if (cfield == 'votes') {
          result = await vote4Entity(child, value);
        }
      }
      else {
        if (method == 'PUT') {
          if (children instanceof Array)
            children.push(value);
          if (field == 'comments') {
            blog.answerNum = children.length;
            blog.answeredOn = new Date();
            blog.answeredBy = user;
          }
          // virtual property
          else if (field == 'votes') {
            result = await vote4Entity(blog, value);
          }
        }
        else {
          let child = children.id(value._id);
          Object.assign(child, value);
          if (field == 'votes') {
            result = await vote4Entity(blog, value);
          }
        }
      }

      await blog.save();

      if (result != undefined) {
        res.send(result);
        return;
      }
      res.sendStatus(204);
    }));
}