import mongoose from 'mongoose';
import moment from 'moment';
import { assign } from 'lodash'

import { api, route, paging } from '../utils';
import { Blog, Tag, User } from '../models';

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
          visits: { $gte: 10 }
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

  router.route('/blogs/:id')
    .get(route.wrap(async (req, res, next) => {
      let {id} = req.params;

      let blog = await Blog.findById(id)
        .populate('author tags comments.author', 'id name title loginId');
      await Blog.update({ _id: id }, { $inc: { visits: 1 } })

      res.send(blog);
    }));

  router.route('/blogs')
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

  router.route('/blogs/:id/:field')
    .put(route.wrap(async (req, res, next) => {
      var user = req.user;
      let {id, field} = req.params;
      var blog = await Blog.findById(id);
      if (!blog)
        throw new Error('问题不存在');

      let value = req.body;
      Object.assign(value, {
        author: user
      });

      let sub = blog[field];
      sub.push(value);
      if (field == 'comments') {
        blog.commentNum = sub.length;
        blog.commentedOn = new Date();
        blog.commentedBy = user;
      }

      await blog.save();

      res.sendStatus(204);
    }))
    .post(route.wrap(async (req, res, next) => {
      var user = req.user;
      let {id, field} = req.params;
      var blog = await Blog.findById(id);
      if (!blog)
        throw new Error('问题不存在');

      let value = req.body;

      let sub = blog[field];
      if (field == 'comments') {
        let comments = sub;
        let comment = comments.find(comment => comment._id == value._id);
        Object.assign(comment, value);
        blog.resolved = comments.some(comment => comment.accepted);
      }

      await blog.save();

      res.sendStatus(204);
    }))
}